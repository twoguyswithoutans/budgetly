import { useCallback, useState, useRef, useEffect } from "react";
import { Category, Item, DashboardContentProp } from "@models";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@useToast";
import Loader from "@Loader";
import DashboardToolbar from "@dashboard/DashboardToolbar";
import DashboardTitleBar from "@dashboard/DashboardTitleBar";
import ContentSidePanel from "./ContentSidePanel";
import AddItemPopup from "./AddItemPopup";
import CategoryItems from "./CategoryItems";
import CategoryTotals from "./CategoryTotals";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, CirclePlus } from "lucide-react";

export default function DashboardContent({ onTriggerRefresh, currentMonth }: Readonly<DashboardContentProp>) {
	const [loading, setLoading] = useState(true);
	const [openCategories, setOpenCategories] = useState<string[]>([]);
	const [openPopup, setOpenPopup] = useState<string | null>(null);
	const [newItemName, setNewItemName] = useState("");
	const popupRef = useRef<HTMLDivElement | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();
	const currentDate = format(new Date(), "yyyy-MM-dd");
	const { showToast } = useToast();

	useEffect(() => {
		async function fetchCategories() {
			setLoading(true);
			const start = format(currentMonth, "yyyy-MM-01");
			const end = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0), "yyyy-MM-dd");

			const { data, error } = await supabase
				.from("categories")
				.select("id, name, items (*)")
				.order("name", { ascending: true });

			if(error) {
				console.error("Error fetching categories:", error)
				setLoading(false);
			}
			else {
				const filtered = data.map((category: any) => ({
					...category,
					items: category.items.filter((i: any) => i.dateAdded >= start && i.dateAdded <= end),
				}));
				setCategories(filtered);
				const autoOpen = filtered
				.filter((category: any) => category.items.length > 0)
				.map((category: any) => category.name);
				setOpenCategories(autoOpen);
			}
			setLoading(false);
		}
		fetchCategories();
	}, [currentMonth]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				setOpenPopup(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	async function handleAssign(categoryId: string) {
		const { data, error } = await supabase
			.from("items")
			.insert([
				{
					title: newItemName || "New Item",
					total: 0,
					appliedAmount: 0,
					repeatMonthly: false,
					dueDate: null,
					category_id: categoryId,
					dateAdded: currentDate
				}
			])
			.select();

		if (error) {
			console.error("Error adding item:", error)
			showToast("Error adding item!", "error")
		}
		else {
			setCategories((prev) =>
				prev.map((category) =>
					category.id === categoryId
						? { ...category, items: [...category.items, data[0]] }
						: category
				)
			)
			onTriggerRefresh()
			showToast("Item added!", "info")
		}
		setOpenPopup(null)
		setNewItemName("")
	}

	const handleSelectedItem = useCallback((item: Item) => {
		setSelectedItem({
			category_id: item.category_id,
			id: item.id,
			title: item.title,
			total: item.total,
			appliedAmount: item.appliedAmount,
			dateAdded: item.dateAdded,
			repeatMonthly: item.repeatMonthly,
			dueDate: item.dueDate,
		})
	}, []);

	const handleItemDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			console.error("Delete failed:", error);
			showToast("Delete failed!", "error")
		}
		else {
			setCategories((prev) =>
				prev.map((category) => ({
					...category,
					items: category.items.filter((i) => i.id !== id),
				}))
			);
			setSelectedItem(undefined);
			onTriggerRefresh();
			showToast("Deleted successfully!", "success")
		}
	};

	const handleSaveItem = async (updatedItem: Item) => {
		if (!updatedItem) return;

		const { error } = await supabase
			.from("items")
			.update({
				title: updatedItem.title,
				total: updatedItem.total,
				appliedAmount: updatedItem.appliedAmount,
				repeatMonthly: updatedItem.repeatMonthly,
				dueDate: updatedItem.dueDate,
				dateAdded: updatedItem.dateAdded,
			})
			.eq("id", updatedItem.id);

		if (error) {
			console.error("Error updating item:", error);
			return;
		}

		setCategories((prev) =>
			prev.map((category) => ({
				...category,
				items: category.items.map((i) =>
					i.id === updatedItem.id ? { ...i, ...updatedItem } : i
				),
			}))
		);

		setSelectedItem(updatedItem);
		onTriggerRefresh();
		setSelectedItem(undefined)
	};

	const localizeNumber = useCallback((number: number) => 
		`$${number.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
	[]);

	const getCategoryTotals = (category: Category) => {
		return category.items.reduce(
			(acc, item) => {
				acc.applied += item.appliedAmount;
				acc.total += item.total;
				acc.due += item.total - item.appliedAmount;
				return acc;
			},
			{ applied: 0, total: 0, due: 0 }
		);
	};


	if(loading) {
		return (
			<div className="flex justify-center items-center h-[65svh] md:h-[70svh] lg:h-[80svh]">
				<Loader title="Dashboard" />
			</div>
		)
	}

	return (
		<div className="flex flex-col lg:flex-row w-full">
			<div className="w-screen lg:w-[55vw] flex flex-col bg-white dark:bg-[#1c1c1e] text-foreground overflow-hidden border-r border-gray-300 dark:border-gray-700">
				<div className="w-full h-[10svh] z-40">
					<DashboardToolbar />
					<DashboardTitleBar />
				</div>
				<div className="w-full h-[65svh] md:h-[70svh] lg:h-[80svh] flex flex-col gap-x-10">
					<div className="h-full overflow-auto">
						{/* Categories */}
						{categories?.map((category) => {
							const isOpen = openCategories.includes(category.name);
							const isPopupOpen = openPopup === category.name;
							return(
								<div key={category.name}>
									{/* Category Header */}
									<div className="relative">
										<div className="flex items-center justify-between px-8 py-3 bg-background hover:bg-secondary border-b border-gray-300 dark:border-gray-700">
											<div className="flex-[2] flex items-center gap-x-3 font-bold relative">
												<button
													onClick={() => {
														if(isOpen) {
															setOpenCategories(
																openCategories.filter((c) => c !== category.name)
															)
														}
														else {
															setOpenCategories(
																[...openCategories, category.name]
															)
														}
													}}
												>
													{isOpen ? (
														<ChevronDown
															size={15}
															className="text-muted-foreground"
														/>
													) : (
														<ChevronRight
															size={15}
															className="text-muted-foreground"
														/>
													)}
												</button>
												<div>{category.name}</div>
												<button
													onClick={() => {
														setOpenPopup(isPopupOpen ? null : category.name);
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
										{/* Add Item Popup */}
										{isPopupOpen && (
											<AddItemPopup
												ref={popupRef}
												newItemName={newItemName}
												setNewItemName={setNewItemName}
												onCancel={() => setOpenPopup(null)}
												onAdd={() => handleAssign(category.id)}
											/>
										)}
									</div>
									{/* Category Items */}
									{isOpen && (
										<CategoryItems
											items={category.items}
											handleSelectedItem={handleSelectedItem}
											localizeNumber={localizeNumber}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{/* Side panel */}
			<div className="lg:relative lg:w-[25vw]">
				{selectedItem ? (
					<ContentSidePanel
						item={selectedItem}
						onSave={handleSaveItem}
						onClose={() => setSelectedItem(undefined)}
						onDelete={handleItemDelete}
					/>
				) : (
					<div className="hidden px-6 lg:h-full lg:flex items-center justify-center text-gray-400">
						Select an item to view or edit.
					</div>
				)}
			</div>
		</div>
	);
}
