import { ItemFormProps } from "@models";
import { HandCoins } from "lucide-react";

export default function ItemForm({ editable, addAmount, currentDate, isRepeat, onChangeAction, onAddAmountAction, onToggleRepeatAction, onCompleteAmountAction }: Readonly<ItemFormProps>) {
	const field = "w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white";

	return (
		<>
			<label htmlFor="title" className="text-sm font-semibold">Item Title</label>
			<input id="title" name="title" value={editable?.title ?? ""} onChange={onChangeAction} className={field} />

			<label htmlFor="total" className="text-sm font-semibold">Total Amount</label>
			<input id="total" name="total" type="number" value={editable?.total ?? 0} onChange={onChangeAction} className={field} />

			<label htmlFor="addAmount" className="text-sm font-semibold">Add Amount</label>
			<input id="addAmount" name="addAmount" type="number" value={addAmount ?? 0} onChange={onAddAmountAction} className={field} />

			<label htmlFor="appliedAmount" className="text-sm font-semibold">Applied Amount</label>
			<input id="appliedAmount" name="appliedAmount" type="number" value={editable?.appliedAmount ?? 0} onChange={onChangeAction} className={field} />

			<label htmlFor="dateAdded" className="text-sm font-semibold">Date</label>
			<input id="dateAdded" name="dateAdded" type="date" value={editable?.dateAdded ?? currentDate} onChange={onChangeAction} className="w-fit border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 dark:bg-[#2a2a2d] dark:text-white" />

			<button
				onClick={onCompleteAmountAction}
				aria-label="Complete Amount"
				className="mb-3 py-2 font-bold gap-x-1 w-full flex justify-center items-center rounded bg-green-100 text-green-700 active:bg-green-200"
			>
				Complete Amount <HandCoins size={20} />
			</button>

			<div className="flex gap-x-2 items-center justify-start">
				<button
					onClick={onToggleRepeatAction}
					aria-label="Repeat"
					className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${isRepeat ? "bg-blue-800" : "bg-gray-300 dark:bg-gray-600"}`}
				>
					<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRepeat ? "translate-x-6" : "translate-x-1"}`} />
				</button>
				<span className="text-sm text-gray-800 dark:text-gray-200">Repeat Monthly</span>
			</div>
		</>
	)
}