"use client";
import { useState, useEffect } from "react";
import { X, Save, Trash } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@useToast";
import { format } from "date-fns";
import { safeAdd, safeDiff } from "@/utils/math";
import ItemForm from "./ItemForm";
import type { ContentSidePanelProps } from "@models";

export default function ContentSidePanel({ item, onSaveAction, onDeleteAction, onCloseAction }: Readonly<ContentSidePanelProps>) {
	const { showToast } = useToast();
	const [editable, setEditable] = useState(item);
	const [addAmount, setAddAmount] = useState<number | null>(null);
	const [isRepeat, setIsRepeat] = useState(false);
	const currentDate = format(new Date(), "yyyy-MM-dd");

	useEffect(() => {
		setEditable(item);
		setIsRepeat(item?.repeatMonthly ?? false);
	}, [item]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setEditable((p) => (p ? { ...p, [e.target.name]: e.target.value } : p));

	const handleAddAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
		setAddAmount(Number(e.target.value));

	const handleSave = async () => {
		if (!editable) return;
		const newApplied = safeAdd(editable.appliedAmount, addAmount);

		if (newApplied > editable.total)
			return showToast("Applied amount cannot be greater than total!", "error");

		const updated = { ...editable, appliedAmount: newApplied, repeatMonthly: isRepeat };
		const { error } = await supabase.from("items").update(updated).eq("id", editable.id);
		if (error) return showToast("Failed to save item!", "error");

		onSaveAction(updated);
		setAddAmount(0);
		showToast("Saved successfully!", "success");
	}

	const completeAmount: () => void = () =>
		editable && setAddAmount(safeDiff(editable.total, editable.appliedAmount));

	return (
		<div className="absolute top-0 bg-background w-screen lg:w-full h-full shadow-md flex flex-col gap-6 p-5 z-50 overflow-auto">
			<header className="flex justify-between items-center">
				<div className="text-xl font-bold">{item?.title}</div>
				<button onClick={onCloseAction} className="text-xl font-bold">
					<X size={20} />
				</button>
			</header>
			<section className="flex flex-col gap-y-3 bg-white dark:bg-[rgb(28,28,30)] rounded-lg p-5 overflow-auto">
				<div className="text-sm font-semibold pb-3 border-b border-background text-gray-800 dark:text-gray-200">
					Add / Change Detail
				</div>
				<ItemForm
					editable={editable}
					addAmount={addAmount}
					currentDate={currentDate}
					isRepeat={isRepeat}
					onChangeAction={handleChange}
					onAddAmountAction={handleAddAmount}
					onToggleRepeatAction={() => setIsRepeat(!isRepeat)}
					onCompleteAmountAction={completeAmount}
				/>
				<footer className="flex justify-between gap-2 mt-5">
					<button
						onClick={() => editable?.id && onDeleteAction(editable.id)}
						className="px-3 py-1 gap-x-1 flex items-center rounded hover:bg-red-100 text-red-700 active:bg-red-200"
					>
						<Trash size={15} /> Delete
					</button>
					<button
						onClick={handleSave}
						className="px-3 py-1 gap-x-1 flex items-center rounded bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white"
					>
						Save <Save size={15} />
					</button>
				</footer>
			</section>
		</div>
	)
}