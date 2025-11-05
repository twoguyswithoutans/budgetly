import { Undo, Redo, History } from "lucide-react";

export default function DashboardToolbar() {
    return (
        <div className="h-[5svh] w-full flex justify-start items-center py-2 px-6 gap-x-5 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c1c1e] text-sm z-30">
            <button className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700">
                <Undo size={15} />
                Undo
            </button>
            <button className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700">
                <Redo size={15} />
                Redo
            </button>
            <button className="flex items-center gap-x-1 text-blue-600 hover:underline">
                <History size={15} />
                Recent Moves
            </button>
        </div>
    )
}
