"use client";
import { memo } from "react";
import { Item, CategoryItemsProps } from "@models";
import { EmptyState } from "@emptyStates/EmptyState";

function CategoryItems({ items, handleSelectedItem, localizeNumber }: CategoryItemsProps) {
	if(items.length === 0) return <EmptyState simple message="No items in this category" />;

	const base = "flex items-center";
	const itemBase = "flex-1 text-right";
	const handleClick = (item: Item) => () => handleSelectedItem(item);
	
  	return (
		<div className="bg-white dark:bg-[#1c1c1e]">
			{items.map((item) => {
				const remaining = item.total - item.appliedAmount;
				return (
				<button
					key={item.id}
					onClick={handleClick(item)}
					className={`${base} w-full justify-between px-8 py-2 text-sm border-b border-gray-300 dark:border-gray-700 hover:bg-[#dee6ff] dark:hover:bg-[#5d616b] active:bg-[#c6d3fd]`}
				>
					<div className={`${base} flex-[2] truncate`}>{item.title}</div>
					<div className={itemBase}>{localizeNumber(item.appliedAmount)}</div>
					<div className={itemBase}>{localizeNumber(item.total)}</div>
					<div className={itemBase}>{localizeNumber(remaining)}</div>
				</button>
				);
			})}
		</div>
	);
}
export default memo(CategoryItems);