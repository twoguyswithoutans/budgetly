"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type ChartItem = {
	name: string;
	value: number;
	color?: string;
};

interface Props {
	totalSpending: number;
	filteredCount: number;
	dateFrom: string;
	dateTo: string;
	chartData: ChartItem[];
}

export default function ExpensesChartCard({ totalSpending, filteredCount, dateFrom, dateTo, chartData }: Readonly<Props>) {
	const COLORS = ["#4F46E5", "#EF4444", "#F59E0B", "#60A5FA"];
	const filteredData = chartData.filter((item) => item.value > 0);
	const total = totalSpending || filteredData.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className="w-full h-[80vh] bg-white dark:bg-[#1c1c1e] rounded-2xl shadow p-5 gap-5 flex flex-col justify-start items-start border border-gray-300 dark:border-gray-700">
			{/* Main Content */}
			<div className="flex flex-col justify-start space-y-2">
				<div className="text-lg font-semibold text-foreground">Total Spending</div>
				<p className="text-4xl font-bold text-foreground">${total.toFixed(2)}</p>
				<p className="text-gray-500">
					Showing <span className="font-semibold">{filteredCount}</span>{" "}
					transactions between{" "}
					<span className="font-semibold">{dateFrom}</span> and{" "}
					<span className="font-semibold">{dateTo}</span>
				</p>
			</div>
			{/* Pie Chart */}
			<div className="h-[320px] w-full flex justify-center items-center overflow-auto">
				{filteredData.length > 0 ? (
					<ResponsiveContainer>
						<PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
							<Pie
								data={filteredData}
								cx="50%"
								cy="50%"
								innerRadius={30}
								outerRadius={90}
								paddingAngle={2}
								dataKey="value"
								label={({ name, percent }) =>
									`${name} ${(percent * 100).toFixed(0)}%`
								}
							>
								{filteredData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend verticalAlign="bottom" height={40} />
						</PieChart>
					</ResponsiveContainer>
				) : (
					<p className="text-gray-500 italic text-sm">No spending data to display</p>
				)}
			</div>
		</div>
	);
}
