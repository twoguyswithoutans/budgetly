"use client";
import { ExpensesChartCardProps } from "@models";
import { EmptyState } from "@emptyStates/EmptyState";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ExpensesChartCard({ totalSpending, filteredCount, dateFrom, dateTo, chartData }: Readonly<ExpensesChartCardProps>) {
	const filteredData = chartData.filter((item) => item.value > 0);
	const total = totalSpending || filteredData.reduce((sum, item) => sum + item.value, 0);
	const COLORS = ["#4F46E5", "#EF4444", "#F59E0B", "#60A5FA"];

	return (
		<div className="w-full h-fit md:h-[80vh] bg-white dark:bg-[#1c1c1e] md:rounded-2xl shadow p-5 gap-5 flex flex-col justify-start items-start border-y md:border border-gray-300 dark:border-gray-700">
			{/* Main Content */}
			<div className="flex flex-col justify-start space-y-2">
				<div className="text-lg font-semibold text-foreground">Total Spending</div>
				<div className="text-4xl font-bold text-foreground">${total.toFixed(2)}</div>
				<div className="text-gray-500">
					Showing <span className="font-semibold">{filteredCount}</span>{" "}
					transactions between{" "}
					<span className="font-semibold">{dateFrom}</span> and{" "}
					<span className="font-semibold">{dateTo}</span>
				</div>
			</div>
			{/* Bar Chart */}
			<div className="h-[320px] w-full flex justify-center items-center overflow-auto text-black">
				{filteredData.length > 0 ? (
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={filteredData}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
						<XAxis
							dataKey="name"
							angle={-15}
							textAnchor="end"
							interval={0}
							height={60}
							tick={{ fontSize: 14 }}
						/>
						<YAxis tick={{ fontSize: 12 }} />
						<Tooltip />
						<Bar dataKey="value" radius={[4, 4, 0, 0]}>
							{filteredData.map((_, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
				) : (
					<EmptyState message="spending" graph={true} />
				)}
			</div>
		</div>
	);
}