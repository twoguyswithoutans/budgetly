export default function DashboardTitleBar() {
    const columns = ["Category", "Applied", "Total", "Due"];

    return (
        <div className="h-[5svh] w-full flex items-center py-2 px-6 text-xs font-semibold text-foreground border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c1c1e] z-30">
			{columns.map((column, index) => (
				<div
                    key={column + index}
                    className={`${index === 0 ? "flex-[2] text-left" : "flex-1 text-right"}`}
                >
					{column}
				</div>
			))}
		</div>
    )
}