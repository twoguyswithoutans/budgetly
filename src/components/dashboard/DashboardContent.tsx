"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, CirclePlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@useToast";
import Loader from "@Loader";
import DashboardTitleBar from "@dashboard/DashboardTitleBar";
import ContentSidePanel from "./ContentSidePanel";
import AddItemPopup from "./AddItemPopup";
import CategoryItems from "./CategoryItems";
import CategoryTotals from "./CategoryTotals";
import { Category, Item, DashboardContentProp } from "@models";

export default function DashboardContent({ onTriggerRefreshAction, currentMonth }: Readonly<DashboardContentProp>) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [openCategories, setOpenCategories] = useState<string[]>([]);
	const [popupCategory, setPopupCategory] = useState<string | null>(null);
	const [newItemName, setNewItemName] = useState("");
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();
	const popupRef = useRef<HTMLDivElement | null>(null);
	const { showToast } = useToast();
	const currentDate = format(new Date(), "yyyy-MM-dd");

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			const start = format(currentMonth, "yyyy-MM-01");
			const end = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0), "yyyy-MM-dd");
			const { data, error } = await supabase
				.from("categories")
				.select("id, name, items (*)")
				.order("name", { ascending: true });

			if (error) {
				console.error("Error fetching categories:", error);
				showToast("Failed to fetch categories", "error");
			}
			else {
				const filtered = (data ?? []).map((c: Category) => ({
					...c,
					items: c.items.filter((i: any) => i.dateAdded >= start && i.dateAdded <= end),
				}));
				setCategories(filtered);
				setOpenCategories(filtered.filter((c) => c.items.length).map((c) => c.name));
			}
			setLoading(false);
		};

		fetchCategories()
	}, [currentMonth, showToast])

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				setPopupCategory(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [])

	const handleAddItem = async (categoryId: string) => {
		const { data, error } = await supabase
			.from("items")
			.insert([
				{
					title: newItemName.trim() || "New Item",
					total: 0,
					appliedAmount: 0,
					repeatMonthly: false,
					category_id: categoryId,
					dateAdded: currentDate,
					dueDate: null,
				},
			])
			.select();

		if (error) return showToast("Error adding item", "error");

		setCategories((prev) =>
			prev.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, data[0]] } : c))
		);
		onTriggerRefreshAction();
		setPopupCategory(null);
		setNewItemName("");
		showToast("Item added successfully", "info");
	}

	const handleItemSave = async (updatedItem: Item) => {
		const { error } = await supabase.from("items").update(updatedItem).eq("id", updatedItem.id);
		if (error) return showToast("Error saving item", "error");

		setCategories((prev) =>
			prev.map((c) => ({
				...c,
				items: c.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
			}))
		);
		setSelectedItem(undefined);
		onTriggerRefreshAction();
		showToast("Item saved", "success");
	}

	const handleItemDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) return showToast("Error deleting item", "error");

		setCategories((prev) =>
			prev.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }))
		);
		setSelectedItem(undefined);
		onTriggerRefreshAction();
		showToast("Item deleted", "success");
	}

	const handleSelectItem = useCallback((item: Item) => setSelectedItem(item), []);
	const localizeNumber = useCallback(
		(num: number) =>
			`$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
		[]
	)

	const getCategoryTotals = (category: Category) =>
		category.items.reduce(
			(acc, i) => ({
				applied: acc.applied + i.appliedAmount,
				total: acc.total + i.total,
				due: acc.due + (i.total - i.appliedAmount),
			}),
			{ applied: 0, total: 0, due: 0 }
		)

	if (loading)
		return (
			<div className="flex justify-center items-center h-[65svh] md:h-[70svh] lg:h-[80svh]">
				<Loader title="Dashboard" />
			</div>
		)
	return (
		<div className="flex flex-col lg:flex-row w-full">
			<div className="w-screen lg:w-[55vw] flex flex-col bg-white dark:bg-[#1c1c1e] border-r border-gray-300 dark:border-gray-700">
				<div className="sticky top-0 z-40 h-[5svh] bg-white dark:bg-[#1c1c1e]">
					<DashboardTitleBar />
				</div>

				<div className="w-full h-[70svh] md:h-[75svh] lg:h-[85svh] flex flex-col gap-x-10">
					<div className="flex-1 overflow-auto">
						{categories.map((category) => {
							const isOpen = openCategories.includes(category.name);
							const isPopupOpen = popupCategory === category.name;

							return (
								<div key={category.id} className="relative">
									{/* Category Header */}
									<div className="flex items-center justify-between px-8 py-3 bg-background hover:bg-secondary border-b border-gray-300 dark:border-gray-700">
										<div className="flex-[2] flex items-center gap-x-3 font-bold">
											<button
												onClick={() =>
													setOpenCategories((prev) =>
														isOpen
															? prev.filter((n) => n !== category.name)
															: [...prev, category.name]
													)
												}
											>
												{isOpen ? (
													<ChevronDown size={15} className="text-muted-foreground" />
												) : (
													<ChevronRight size={15} className="text-muted-foreground" />
												)}
											</button>
											<div>{category.name}</div>
											<button
												onClick={() => {
													setPopupCategory(isPopupOpen ? null : category.name);
													setNewItemName("");
												}}
											>
												<CirclePlus size={18} className="text-blue-600" />
											</button>
										</div>

										<CategoryTotals
											category={category}
											getCategoryTotals={getCategoryTotals}
											localizeNumber={localizeNumber}
										/>
									</div>

									{/* Popup */}
									{isPopupOpen && (
										<AddItemPopup
											ref={popupRef}
											newItemName={newItemName}
											setNewItemName={setNewItemName}
											onCancel={() => setPopupCategory(null)}
											onAdd={() => handleAddItem(category.id)}
										/>
									)}

									{/* Items */}
									{isOpen && (
										<CategoryItems
											items={category.items}
											handleSelectedItem={handleSelectItem}
											localizeNumber={localizeNumber}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{/* Right: Side Panel */}
			<div className="lg:relative lg:w-[25vw]">
				{selectedItem ? (
					<ContentSidePanel
						item={selectedItem}
						onSaveAction={handleItemSave}
						onDeleteAction={handleItemDelete}
						onCloseAction={() => setSelectedItem(undefined)}
					/>
				) : (
					<div className="hidden px-6 lg:flex h-full items-center justify-center text-gray-400">
						Select an item to view or edit.
					</div>
				)}
			</div>
		</div>
	);
}