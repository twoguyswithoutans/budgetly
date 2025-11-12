import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActiveGoalsProp } from "@models";
import { EmptyState } from "@emptyStates/EmptyState";

const GoalCard = ({ name, progress, type }: ActiveGoalsProp) => (
	<div className="w-full bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<div className="flex items-center gap-3 w-full sm:w-auto">
			<div className="font-semibold text-sm">{name}</div>
			<div
				className={`text-xs px-2 py-0.5 rounded-full ${
					type === "debt"
						? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
						: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
					}`
				}
			>{type}</div>
		</div>
		<div className="flex-1 w-full sm:w-auto">
			<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
				<div
					className="h-full bg-blue-500 transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="text-xs text-gray-500">{progress}% completed</div>
		</div>
	</div>
);

export default function ActiveGoals({ goals }: { goals: ActiveGoalsProp[] }) {
	const router = useRouter();
	const activeGoals = useMemo(() => {
		return goals
		.filter((g) => g.progress < 100)
		.sort((a, b) => {
			if (a.dateAdded && b.dateAdded)
			return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
			return 0;
		});
	}, [goals]);

  	const lastThree = activeGoals.slice(0, 3);

	return (
		<div className="w-full bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-gray-700 rounded-lg p-5 shadow-sm">
		<div className="flex justify-between items-center mb-4">
			<div className="text-lg font-bold">Active Goals</div>
			{activeGoals.length > 3 && (
				<button
					onClick={() => router.push("/goals")}
					aria-label="View All"
					className="text-sm text-blue-600 hover:underline"
				>
					View All
				</button>
			)}
		</div>

		{lastThree.length > 0 ? (
			<div className="flex flex-col gap-3">
				{lastThree.map((goal, idx) => (
					<GoalCard key={idx} {...goal} />
				))}
			</div>
		) : (
			<EmptyState message="goals" graph={false} />
		)}
		</div>
	);
}