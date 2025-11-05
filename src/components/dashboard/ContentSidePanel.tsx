import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from "react";
import { HandCoins, Save, Trash, X } from "lucide-react";
import { format } from "date-fns";

interface ContentSidePanelProps {
	item?: {
		id: string;
		category_id: string;
		title: string;
		total: number;
		appliedAmount: number;
		dateAdded: string;
		repeatMonthly: boolean;
		dueDate?: string | null;
	};
	onSave: (updatedItem?: any) => void;
	onDelete: ((id: string) => void );
	onClose: () => void;
}

function safeAdd(a: unknown, b: unknown): number {
	const numA = Number(a);
	const numB = Number(b);
	if (Number.isNaN(numA) || Number.isNaN(numB)) return numA;
	return numA + numB;
}

function safeDiff(a: unknown, b: unknown): number {
	const numA = Number(a);
	const numB = Number(b);
	if (Number.isNaN(numA) || Number.isNaN(numB)) return numA;
	return numA - numB;
}

export default function ContentSidePanel({ item, onSave, onDelete, onClose }: Readonly<ContentSidePanelProps>) {
	const [isRepeat, setIsRepeat] = useState(false);
	const currentDate = format(new Date(), "yyyy-MM-dd");
	const [editable, setEditable] = useState(item);
	const [addAmount, setAddAmount] = useState<number | null>(null);

	useEffect(() => {
		setEditable(item);
		setIsRepeat(item?.repeatMonthly ?? false);
	}, [item])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditable((prev) => (prev ? { ...prev, [name]: value } : prev));
	};

	const handleAddAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddAmount(Number(e.target.value));
	};

	const handleSave = async () => {
		if (!editable) return;
		const newApplied = safeAdd(editable.appliedAmount, addAmount);

		if (newApplied > editable.total) {
			// alert("Applied amount cannot be greater than total!");
			return;
		}

		const updatedItem = {
			...editable,
			appliedAmount: newApplied,
			repeatMonthly: isRepeat,
		};

		const { error } = await supabase
			.from("items")
			.update(updatedItem)
			.eq("id", editable.id);

		if (error) {
			console.error(error);
			// alert("Failed to save item!");
			return;
		}

		onSave(updatedItem);
		setAddAmount(0)
		// alert("Item updated successfully!");
	};

	const completeAmount = () => {
		if (!editable) return;
		const completeAmount = safeDiff(editable.total, editable.appliedAmount);
		setAddAmount(completeAmount)
	};

	return (
		<div className="absolute top-0 bg-background py-5 px-5 md:py-5 w-screen md:w-full h-full shadow-md flex flex-col gap-6 z-50 overflow-auto ">
			<div className="flex justify-between items-center">
				<div className="text-xl font-bold">{item?.title}</div>
				<button
					onClick={() => onClose()}
					className="text-xl font-bold">
					<X size={20} />
				</button>
			</div>
			<div>
				<div className="w-full h-fit flex flex-col gap-y-3 bg-white dark:bg-[rgb(28,28,30)] rounded-lg p-5">
					<div className="text-sm font-semibold pb-3 text-gray-800 dark:text-gray-200 border-b border-background">
						Add / Change Detail
					</div>

					<div className="flex flex-col gap-y-1">
						<label htmlFor="title" className="text-sm font-semibold">
							Item Title
						</label>
						<input
							id="title"
							type="text"
							name="title"
							value={editable?.title ?? ""}
							onChange={handleChange}
							placeholder="Item Title"
							className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
						/>
						<label htmlFor="total" className="text-sm font-semibold">
							Total Amount
						</label>
						<input
							id="total"
							type="number"
							name="total"
							value={editable?.total ?? 0}
							onChange={handleChange}
							placeholder="Total Amount"
							className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
						/>

						<label htmlFor="addAmount" className="text-sm font-semibold">
							Add Amount
						</label>
						<input
							id="addAmount"
							type="number"
							name="addAmount"
							value={addAmount ?? 0}
							onChange={handleAddAmount}
							placeholder="Add Amount"
							className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
						/>
						<label htmlFor="appliedAmount" className="text-sm font-semibold">
							Applied Amount
						</label>
						<input
							id="appliedAmount"
							type="number"
							name="appliedAmount"
							value={editable?.appliedAmount ?? 0}
							onChange={handleChange}
							placeholder="Add Amount"
							className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
						/>
						<label htmlFor="dateAdded" className="text-sm font-semibold">
							Date
						</label>
						<input
							id="dateAdded"
							type="date"
							name="dateAdded"
							value={editable?.dateAdded ?? currentDate}
							onChange={handleChange}
							className="w-fit border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
						/>
						<button
							onClick={() => completeAmount()}
							className="mb-3 py-2 font-bold gap-x-1 w-full flex justify-center items-center rounded bg-green-100 text-green-700 active:bg-green-200">
							Complete Amount
							<HandCoins size={20} />
						</button>
						<div className="flex gap-x-2 items-center justify-start">
							<button
								onClick={() => setIsRepeat(!isRepeat)}
								value={(editable?.repeatMonthly ?? false).toString()}
								className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${
									isRepeat
										? "bg-blue-800"
										: "bg-gray-300 dark:bg-gray-600"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										isRepeat ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
							<span className="text-sm text-gray-800 dark:text-gray-200">
								Repeat Monthly
							</span>
						</div>
					</div>
					<div className="flex justify-between gap-2 mt-5">
						<button
							onClick={() => {
								if (editable?.id) onDelete(editable.id);
							}}
							className="px-3 py-1 gap-x-1 flex justify-center items-center rounded hover:bg-red-100 text-red-700 active:bg-red-200"
						>
							<Trash size={15} />
							Delete
						</button>

						<button
							onClick={() => handleSave()}
							className="px-3 py-1 gap-x-1 flex justify-center items-center rounded bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white">
							Save
							<Save size={15} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}