"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { startOfMonth, endOfMonth, subMonths, format, parseISO, isAfter, isBefore } from "date-fns";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Overview() {
	const router = useRouter();
	const [showAI, setShowAI] = useState(false);
	const [filter, setFilter] = useState("This Month");
	const [dateRange, setDateRange] = useState({
		from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
		to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
	});
	const [summary, setSummary] = useState({ income: 0, expenses: 0, savings: 0 });
	const [spendingData, setSpendingData] = useState<any[]>([]);
	const [trendData, setTrendData] = useState<any[]>([]);
	const [goals, setGoals] = useState<any[]>([]);
	const [aiLoading, setAiLoading] = useState(false);
	const [aiText, setAiText] = useState<string>("");
	const [aiError, setAiError] = useState<string | null>(null);

	useEffect(() => {
		const today = new Date();
		if (filter === "This Month") {
			setDateRange({
				from: format(startOfMonth(today), "yyyy-MM-dd"),
				to: format(endOfMonth(today), "yyyy-MM-dd"),
			});
		} else if (filter === "Last Month") {
			const lastMonth = subMonths(today, 1);
			setDateRange({
				from: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
				to: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
			});
		} else if (filter === "Last 3 Months") {
			const threeMonthsAgo = subMonths(today, 2);
			setDateRange({
				from: format(startOfMonth(threeMonthsAgo), "yyyy-MM-dd"),
				to: format(endOfMonth(today), "yyyy-MM-dd"),
			});
		}
	}, [filter]);

	useEffect(() => {
		const fetchData = async () => {
			const { data: categories } = await supabase
				.from("categories")
				.select(
					"id, name, items(id, title, total, appliedAmount, dateAdded, dueDate)"
				);

			const { data: networthData } = await supabase
				.from("net_worth")
				.select("amount")
				.limit(1)
				.single();

			const netWorth = networthData?.amount ?? 0;
			const fromDate = parseISO(dateRange.from);
			const toDate = parseISO(dateRange.to);
			let totalIncome = 0;
			let totalExpenses = 0;

			categories?.forEach((cat) => {
				const filteredItems = cat.items?.filter((item) => {
					const date = parseISO(item.dateAdded);
					return !isBefore(date, fromDate) && !isAfter(date, toDate);
				});

				const catTotal = filteredItems?.reduce(
					(sum, item) => sum + Number(item.appliedAmount ?? 0),
					0
				);

				if (cat.name === "Income") totalIncome += catTotal;
				else totalExpenses += catTotal;
			});

			setSummary({
				income: totalIncome,
				expenses: totalExpenses,
				savings: netWorth,
			});

			const expenseCats = categories
				?.filter((c) => c.name !== "Income")
				.map((c) => {
					const filteredItems = c.items?.filter((item) => {
						const date = parseISO(item.dateAdded);
						return !isBefore(date, fromDate) && !isAfter(date, toDate);
					});
					return {
						name: c.name,
						value: filteredItems?.reduce(
							(sum, i) => sum + Number(i.appliedAmount ?? 0),
							0
						),
					};
				})
				.filter((c) => c.value > 0);

			setSpendingData(expenseCats || []);

			const monthMap: Record<string, { income: number; expenses: number }> = {};
			categories?.forEach((cat) => {
				cat.items?.forEach((item) => {
					const date = parseISO(item.dateAdded);
					if (isBefore(date, fromDate) || isAfter(date, toDate)) return;

					const month = new Date(item.dateAdded).toLocaleString("en", {
						month: "short",
					});
					if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 };
					if (cat.name === "Income")
						monthMap[month].income += Number(item.appliedAmount ?? 0);
					else monthMap[month].expenses += Number(item.appliedAmount ?? 0);
				});
			});

			const monthlyTrend = Object.entries(monthMap).map(([month, vals]) => ({
				month,
				...vals,
			}));
			setTrendData(monthlyTrend);

			const savingsCat = categories?.find((c) => c.name === "Savings");
			const debtCat = categories?.find((c) => c.name === "Debt");

			const allGoals = [
				...(savingsCat?.items || []).map((i) => ({
					name: i.title,
					progress:
						i.total > 0 ? Math.round((i.appliedAmount / i.total) * 100) : 0,
					type: "saving",
				})),
				...(debtCat?.items || []).map((i) => ({
					name: i.title,
					progress:
						i.total > 0 ? Math.round((i.appliedAmount / i.total) * 100) : 0,
					type: "debt",
				})),
			];

			setGoals(allGoals);
		};

		fetchData();
	}, [dateRange]);

	async function askAI() {
		setAiLoading(true);
		setAiError(null);
		setAiText("");
		setShowAI(true);

		try {
			const res = await fetch("/api/ai-insights", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ summary, spendingData, goals, dateRange }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to get insights");
			setAiText(json.text || "");
		} catch (e: any) {
			setAiError(e.message || "Something went wrong");
		} finally {
			setAiLoading(false);
		}
	}

	const total = [
		{ title: "Total Income", value: summary.income, color: "text-green-600" },
		{ title: "Total Expenses", value: summary.expenses, color: "text-red-600" },
		{ title: "Net Worth", value: summary.savings, color: "text-blue-600" },
	];

	return (
		<div className="p-6 space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center flex-wrap gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Overview</h1>
					<p className="text-muted">Your financial summary & insights</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 sm:items-center">
					<select
						className="border rounded-lg px-3 py-1 text-sm"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					>
						<option>This Month</option>
						<option>Last Month</option>
						<option>Last 3 Months</option>
						<option>Custom Range</option>
					</select>
					{filter === "Custom Range" && (
						<div className="flex items-center gap-2 text-sm">
							<input
								type="date"
								value={dateRange.from}
								onChange={(e) =>
									setDateRange({ ...dateRange, from: e.target.value })
								}
								className="border rounded-lg px-2 py-1"
							/>
							<span>-</span>
							<input
								type="date"
								value={dateRange.to}
								onChange={(e) =>
									setDateRange({ ...dateRange, to: e.target.value })
								}
								className="border rounded-lg px-2 py-1"
							/>
						</div>
					)}
				</div>
			</div>
			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{total.map((item, i) => (
					<div
						key={i}
						className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow p-5"
					>
						<h3 className="text-foreground text-sm">{item.title}</h3>
						<p className={`text-2xl font-semibold ${item.color}`}>
							$
							{item.value.toLocaleString("en-US", {
								minimumFractionDigits: 0,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>
				))}
			</div>
			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Spending Breakdown */}
				<div className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow p-4">
					<div className="font-semibold mb-3">Spending Breakdown</div>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={spendingData}
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
								{spendingData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
				{/* Income vs Expenses */}
				<div className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow p-4">
					<h2 className="font-semibold mb-3">Income vs Expenses</h2>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={trendData}>
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="income"
								stroke="#10b981"
								strokeWidth={2}
							/>
							<Line
								type="monotone"
								dataKey="expenses"
								stroke="#ef4444"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
			{/* Goal Progress */}
			<div className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow p-6">
				<h2 className="font-semibold mb-4">Goal Progress</h2>
				<div className="space-y-3">
					{goals.map((goal, i) => (
						<div key={i}>
							<div className="flex justify-between text-sm font-medium text-primary">
								<span>{goal.name}</span>
								<span>{goal.progress}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full transition-all ${
										goal.type === "saving" ? "bg-[#22c55e]" : "bg-[#ef4444]"
									}`}
									style={{ width: `${goal.progress}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
				<button
					onClick={() => router.push("/goals")}
					className="mt-4 text-blue-600 text-sm font-medium hover:underline"
				>
					View All Goals
				</button>
			</div>

			{/* AI Insights */}
			<div className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow p-6">
				<h2 className="font-semibold mb-3 flex items-center gap-2">🧠 AI Insights</h2>
				<p className="text-primary mb-4">
					Get personalized tips based on your spending and saving patterns.
				</p>
				<button
					onClick={askAI}
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
				>
					Ask AI for insights
				</button>
			</div>
			{/* AI Popup */}
			{showAI && (
				<div className="fixed -inset-10 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-[#2a2a2d] rounded-2xl shadow-lg w-full max-w-md p-6">
						<div className="text-lg font-semibold mb-2">AI Insights</div>
						<div className="text-primary mb-4 text-sm whitespace-pre-wrap">
							{aiLoading
								? "Analyzing your data…"
								: aiError
								? `Error: ${aiError}`
								: aiText || "(No insights yet for this period.)"}
						</div>
						<button
							onClick={() => setShowAI(false)}
							className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
