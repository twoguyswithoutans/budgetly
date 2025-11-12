import { ExpensesChartCardProps } from "@models";
import { ChartLazyLoader } from "@loader/ChartLazyLoader"

export default function ExpensesChartCard({ totalSpending, filteredCount, dateFrom, dateTo, chartData }: Readonly<ExpensesChartCardProps>) {
	const filteredData = chartData.filter((item) => item.value > 0);
	const total = totalSpending || filteredData.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className="w-full h-fit lg:h-[80vh] bg-white dark:bg-[#1c1c1e] lg:rounded-2xl shadow p-5 gap-5 flex flex-col justify-start items-start border-y lg:border border-gray-300 dark:border-gray-700">
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
			<ChartLazyLoader chartData={filteredData} />
		</div>
	)
}