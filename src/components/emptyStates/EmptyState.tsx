import { EmptyStateProps } from "@models";
import { ChartColumnBig, Clock } from "lucide-react";

export const EmptyState = ({ simple, message, graph }: EmptyStateProps) => {
    const base = "flex items-center p-4 text-sm text-gray-500 dark:text-gray-400";
    const border = "border-b border-gray-300 dark:border-gray-700";
    const Icon = graph ? ChartColumnBig : Clock;

    return(
        <>
            {simple ? (
                <div className={`${base} justify-start gap-x-4 ${border}`}>
                    <Clock size={15} />
                    {message}
                </div>
            ): (
                <div className={`${base} flex-col justify-center`}>
                    <Icon size={25} />
                    <div className="text-center py-4">
                        <div>No active {message}.</div>
                        <div>Add a new {message} to start tracking progress.</div>
                    </div>
                </div>
            )}
        </>
    )
}