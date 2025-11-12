import { forwardRef } from "react";
import type { AddItemPopupProps } from "@models";

const AddItemPopup = forwardRef<HTMLDivElement, AddItemPopupProps>(
	({ newItemName, setNewItemName, onCancel, onAdd }, ref) => (
		<div
			ref={ref}
			className="absolute top-0 left-8  w-[60vw] md:w-[40vw] lg:w-[20vw] p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c1c1e] shadow-lg z-50 over"
		>
			<div className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
				Add Item
			</div>
			<input
				type="text"
				value={newItemName}
				onChange={(e) => setNewItemName(e.target.value)}
				placeholder="Enter Item Name"
				className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#2a2a2d] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					aria-label="Cancel"
					className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onAdd}
					aria-label="Add"
					className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
				>
					Add
				</button>
			</div>
		</div>
	)
);
AddItemPopup.displayName = "AddItemPopup";
export default AddItemPopup;