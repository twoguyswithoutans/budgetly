export default function DashboardTitleBar() {
    return (
        <div className="h-[5svh] w-full flex items-center py-2 px-6 text-foreground border-b border-gray-300 dark:border-gray-700 font-semibold bg-white dark:bg-[#1c1c1e] text-xs z-30">
            <div className="flex-[2]">Category</div>
            <div className="flex-1 text-right">Applied</div>
            <div className="flex-1 text-right">Total</div>
            <div className="flex-1 text-right">Due</div>
        </div>
    )
}
