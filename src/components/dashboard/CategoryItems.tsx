import { memo } from "react";
import type { Item, CategoryItemsProps } from "@models";
import { EmptyState } from "@emptyStates/EmptyState";

function CategoryItems({ items, handleSelectedItem, localizeNumber }: Readonly<CategoryItemsProps>) {
	if (!items.length)
		return <EmptyState simple message="No items in this category" />;

	const baseRow = "flex items-center w-full justify-between px-8 py-2 text-sm border-b border-gray-300 dark:border-gray-700";
	const textRight = "flex-1 text-right";
	const baseBg = "hover:bg-[#dee6ff] dark:hover:bg-[#5d616b] active:bg-[#c6d3fd]";

	const handleClick = (item: Item) => () => handleSelectedItem(item);

	return (
		<div className="bg-white dark:bg-[#1c1c1e]">
			{items.map((item) => {
				const { id, title, appliedAmount, total } = item;
				const remaining = total - appliedAmount;

				return (
					<button
						key={id}
						onClick={handleClick(item)}
						aria-label="Category Item"
						className={`${baseRow} ${baseBg}`}
					>
						<div className="flex flex-[2] items-center truncate">{title}</div>
						<div className={textRight}>{localizeNumber(appliedAmount)}</div>
						<div className={textRight}>{localizeNumber(total)}</div>
						<div className={textRight}>{localizeNumber(remaining)}</div>
					</button>
				);
			})}
		</div>
	)
}
export default memo(CategoryItems);