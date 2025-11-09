import { Clock } from "lucide-react";

export const EmptyMiniState = ({ message }: { message: string }) => (
    <div className="gap-x-4 flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
        <div className="text-3xl">
                <Clock size={25} />
        </div>
        <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500 dark:text-gray-400">
            <div className="text-sm text-gray-500 dark:text-gray-400">No active {message} right now</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Add a new {message} to start tracking progress.</div>
        </div>
    </div>
);