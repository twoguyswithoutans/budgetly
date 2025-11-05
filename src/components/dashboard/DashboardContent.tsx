import { useState, useRef, useEffect } from "react";
import Loader from "Loader";
import { supabase } from "@/lib/supabaseClient";
import { ChevronDown, ChevronRight, CirclePlus, Undo, Redo, History } from "lucide-react";
import DashboardToolbar from "dashboard/DashboardToolbar";
import DashboardTitleBar from "dashboard/DashboardTitleBar";
import ContentSidePanel from "./ContentSidePanel";
import { format } from "date-fns";

interface Item {
	id: string;
	title: string;
	total: number;
	appliedAmount: number;
	dateAdded: string;
	repeatMonthly: boolean;
	dueDate: string | null;
	category_id: string;
}

interface Category {
	id: string;
	name: string;
	items: Item[];
}

interface DashboardContentTriggerRefreshProp {
	onTriggerRefresh: () => void;
	currentMonth: Date;
}

export default function DashboardContent({ onTriggerRefresh, currentMonth }: Readonly<DashboardContentTriggerRefreshProp>) {
	const [loading, setLoading] = useState(true);
	const [openCategories, setOpenCategories] = useState<string[]>([]);
	const [openPopup, setOpenPopup] = useState<string | null>(null);
	const [newItemName, setNewItemName] = useState("");
	const popupRef = useRef<HTMLDivElement | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();
	const currentDate = format(new Date(), "yyyy-MM-dd");

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
				const filtered = data.map((cat: any) => ({
					...cat,
					items: cat.items.filter((i: any) => i.dateAdded >= start && i.dateAdded <= end),
				}));
				setCategories(filtered);
				const autoOpen = filtered
				.filter((cat: any) => cat.items.length > 0)
				.map((cat: any) => cat.name);
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
					dateAdded: currentDate,
				},
			])
			.select();

		if (error) {
			console.error("Error adding item:", error);
		} else {
			setCategories((prev) =>
				prev.map((category) =>
					category.id === categoryId
						? { ...category, items: [...category.items, data[0]] }
						: category
				)
			);
			onTriggerRefresh();
		}

		setOpenPopup(null);
		setNewItemName("");
	}

	function handleSelectedItem(item: Item) {
		setSelectedItem({
			category_id: item.category_id,
			id: item.id,
			title: item.title,
			total: item.total,
			appliedAmount: item.appliedAmount,
			dateAdded: item.dateAdded,
			repeatMonthly: item.repeatMonthly,
			dueDate: item.dueDate,
		});
	}

	const handleItemDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			console.error("Delete failed:", error);
		} else {
			setCategories((prev) =>
				prev.map((cat) => ({
					...cat,
					items: cat.items.filter((i) => i.id !== id),
				}))
			);
			setSelectedItem(undefined);
			onTriggerRefresh();
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
			prev.map((cat) => ({
				...cat,
				items: cat.items.map((i) =>
					i.id === updatedItem.id ? { ...i, ...updatedItem } : i
				),
			}))
		);

		setSelectedItem(updatedItem);
		onTriggerRefresh();
		setSelectedItem(undefined)
	};

	const localizeNumber = (number: number) => {
		return number.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});
	};

	if(loading) {
		return (
			<div className="flex justify-center items-center h-[65svh] md:h-[80svh]">
				<Loader title="Dashboard" />
			</div>
		)
	}

	return (
		<div className="flex flex-col md:flex-row w-full">
			<div className="w-screen md:w-[55vw] flex flex-col bg-white dark:bg-[#1c1c1e] text-foreground overflow-hidden border-r border-gray-300 dark:border-gray-700">
				<div className="w-full h-[10svh] z-40">
					<DashboardToolbar />
					<DashboardTitleBar />
				</div>
				<div className="w-full h-[65svh] md:h-[80svh] flex flex-col gap-x-10">
					<div className="h-full overflow-auto">
						{/* Categories */}
						{categories?.map((cat) => {
							const isOpen = openCategories.includes(cat.name);
							const isPopupOpen = openPopup === cat.name;

							return (
								<div key={cat.name}>
									{/* Category Header */}
									<div className="relative">
										<div className="flex items-center justify-between px-6 py-3 bg-background hover:bg-secondary border-b border-gray-300 dark:border-gray-700">
											<div className="flex-[2] flex items-center gap-x-3 font-bold relative">
												<button
													onClick={() => {
														if(isOpen) {
															setOpenCategories(
																openCategories.filter((c) => c !== cat.name)
															);
														} else {
															setOpenCategories([...openCategories, cat.name]);
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
												<div>{cat.name}</div>
												<button
													onClick={() => {
														setOpenPopup(isPopupOpen ? null : cat.name);
														setNewItemName("");
													}}
												>
													<CirclePlus size={18} className="text-blue-600" />
												</button>
											</div>

											<div className="text-right flex-1 font-semibold">$0.00</div>
											<div className="text-right flex-1 font-semibold">$0.00</div>
											<div className="text-right flex-1 font-semibold">$0.00</div>
										</div>
										{isPopupOpen && (
											<div
												ref={popupRef}
												className="absolute top-full left-10 w-[50vw] md:w-[15vw] bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-4 z-20"
											>
												<div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
													Add Item
												</div>
												<input
													type="text"
													placeholder="Enter Item Name"
													value={newItemName}
													onChange={(e) => setNewItemName(e.target.value)}
													className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
												/>
												<div className="flex justify-end gap-2">
													<button
														onClick={() => setOpenPopup(null)}
														className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
													>
														Cancel
													</button>
													<button
														onClick={() => handleAssign(cat.id)}
														className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
													>
														Add
													</button>
												</div>
											</div>
										)}
									</div>
									{/* Items */}
									{isOpen && (
										<div className="bg-white dark:bg-[#1c1c1e] group">
											{cat.items.map((item) => (
												<button
													key={item.id}
													onClick={() => handleSelectedItem(item)}
													className="w-full h-fit flex justify-between items-center px-8 py-2 text-sm border-b border-gray-300 dark:border-gray-700 hover:bg-[#dee6ff] dark:hover:bg-[#5d616b] active:bg-[#c6d3fd]"
												>
													<div className="flex-[2] truncate flex items-center gap-x-2">
														{item.title}
													</div>
													<div className="flex-1 text-right">
														$
														{item.appliedAmount.toLocaleString("en-US", {
															minimumFractionDigits: 0,
															maximumFractionDigits: 2,
														})}
													</div>
													<div className="flex-1 text-right">
														$
														{localizeNumber(item.total)}
													</div>
													<div className="flex-1 text-right">
														$
														{(
															item.total - item.appliedAmount
														).toLocaleString("en-US", {
															minimumFractionDigits: 0,
															maximumFractionDigits: 2,
														})}
													</div>
												</button>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{/* Side panel */}
			<div className="md:relative md:w-[25vw]">
				{selectedItem ? (
					<ContentSidePanel
						item={selectedItem}
						onSave={handleSaveItem}
						onClose={() => setSelectedItem(undefined)}
						onDelete={handleItemDelete}
					/>
				) : (
					<div className="hidden md:h-full md:flex items-center justify-center text-gray-400">
						Select an item to view or edit.
					</div>
				)}
			</div>
		</div>
	);
}
