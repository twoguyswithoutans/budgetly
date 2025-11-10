"use client";
import { AddItemPopupProps } from "@models";
import { forwardRef } from "react";

const AddItemPopup = forwardRef<HTMLDivElement, AddItemPopupProps>(
    ({ newItemName, setNewItemName, onCancel, onAdd }, ref) => {
        return(
            <div
                ref={ref}
                className="absolute top-full left-10 w-[50vw] md:w-[15vw] bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-4 z-20"
            >
                <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Add Item</div>
                <input
                    type="text"
                    placeholder="Enter Item Name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
                    >Cancel</button>
                    <button
                        onClick={onAdd}
                        className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >Add</button>
                </div>
            </div>
        )
    }
)
AddItemPopup.displayName = "AddItemPopup";
export default AddItemPopup;