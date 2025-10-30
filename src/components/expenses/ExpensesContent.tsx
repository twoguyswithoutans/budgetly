"use client";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ExpensesChartCard from "./ExpensesChartCard";
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth } from "date-fns";

type Transaction = {
	id: string;
	title: string;
	category: string;
	amount: number;
	date: string;
	notes?: string;
};

function sum(arr: number[]) {
	return arr.reduce((a, b) => a + b, 0);
}

export default function ExpensesContent() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	const [rangePreset, setRangePreset] = useState
		<"this_month" | "last_3_months" | "this_year" | "all_time" | "custom">("this_month");
	const [customFrom, setCustomFrom] = useState<string>("2024-01-01");
	const [customTo, setCustomTo] = useState<string>(
		new Date().toISOString().slice(0, 10)
	);
	const [selectedCategories, setSelectedCategories] = useState<string[] | null>(null);
	const [today] = useState(() => new Date());

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			const { data: incomeCategory } = await supabase
				.from("categories")
				.select("id")
				.eq("name", "Income")
				.single();

			let query = supabase
				.from("items")
				.select(`id, title, total, appliedAmount, dateAdded, dueDate, repeatMonthly, categories(name)`);

			if (incomeCategory) {
				query = query.neq("category_id", incomeCategory.id);
			}

			const { data, error } = await query;

			if (error) {
				console.error("Error fetching items:", error);
				setTransactions([]);
				setLoading(false);
				return;
			}

			const mapped: Transaction[] =
				data?.map((item: any) => ({
					id: item.id,
					title: item.title,
					category: item.categories?.name || "Uncategorized",
					amount: Number(item.appliedAmount) || 0,
					date: item.dateAdded,
					notes: item.dueDate ? `Due: ${item.dueDate}` : undefined,
				})) ?? [];

			setTransactions(mapped);
			setLoading(false);
		};

		fetchData();
	}, []);

	const allCategories = useMemo(() => {
		const set = new Set<string>();
		transactions.forEach((t) => set.add(t.category));
		return Array.from(set).sort();
	}, [transactions]);

	const dateRange = useMemo(() => {
		let from: Date;
		let to: Date = new Date(today);

		if (rangePreset === "this_month") {
			from = startOfMonth(today);
			to = endOfMonth(today);
		} else if (rangePreset === "last_3_months") {
			const d = new Date(today);
			d.setMonth(d.getMonth() - 2);
			from = startOfMonth(d);
			to = endOfMonth(today);
		} else if (rangePreset === "this_year") {
			from = new Date(today.getFullYear(), 0, 1);
			to = endOfMonth(today);
		} else if (rangePreset === "custom") {
			from = customFrom ? parseISO(customFrom) : new Date(0);
			to = customTo ? parseISO(customTo) : new Date();
		} else {
			from = new Date(0);
			to = new Date();
		}
		return { from, to };
	}, [rangePreset, customFrom, customTo, today]);

	const filtered = useMemo(() => {
		return transactions.filter((t) => {
			const d = parseISO(t.date);
			if (isBefore(d, dateRange.from) || isAfter(d, dateRange.to)) return false;
			if (selectedCategories && selectedCategories.length > 0) {
				return selectedCategories.includes(t.category);
			}
			return true;
		});
	}, [transactions, dateRange, selectedCategories]);

	const byCategory = useMemo(() => {
		const map = new Map<string, number>();
		filtered.forEach((t) => {
			map.set(t.category, (map.get(t.category) || 0) + t.amount);
		});
		const arr = Array.from(map.entries()).map(([category, value]) => ({
			category,
			value: Math.round(value * 100) / 100,
		}));
		arr.sort((a, b) => b.value - a.value);
		return arr;
	}, [filtered]);

	const totalSpending = useMemo(
		() => sum(filtered.map((t) => t.amount)),
		[filtered]
	);

	const stats = useMemo(() => {
		const months = Math.max(
			1,
			(dateRange.to.getFullYear() - dateRange.from.getFullYear()) * 12 +
				(dateRange.to.getMonth() - dateRange.from.getMonth()) +
				1
		);
		const days = Math.max(
			1,
			Math.ceil(
				(dateRange.to.getTime() - dateRange.from.getTime()) /
					(1000 * 60 * 60 * 24)
			)
		);

		const avgMonthly = Math.round((totalSpending / months) * 100) / 100;
		const avgDaily = Math.round((totalSpending / days) * 100) / 100;
		const mostSpentCategory =
			byCategory.length > 0 ? byCategory[0].category : "—";
		const largestOutflow =
			filtered.length > 0
				? filtered.slice().sort((a, b) => b.amount - a.amount)[0]
				: null;

		return {
			avgMonthly,
			avgDaily,
			mostSpentCategory,
			largestOutflow,
			months,
			days,
		};
	}, [dateRange, totalSpending, byCategory, filtered]);

	const sideItems = useMemo(() => {
		return [...filtered].sort((a, b) => b.amount - a.amount);
	}, [filtered]);

	const chartData = byCategory.map((c, i) => ({
		name: c.category,
		value: c.value,
	}));

	const toggleCategory = (cat: string) => {
		if (!selectedCategories) {
			setSelectedCategories([cat]);
			return;
		}
		if (selectedCategories.includes(cat)) {
			const next = selectedCategories.filter((c) => c !== cat);
			setSelectedCategories(next.length === 0 ? null : next);
		} else {
			setSelectedCategories([...selectedCategories, cat]);
		}
	};

	const resetCategories = () => setSelectedCategories(null);

	if(loading) {
		return (
			<div className="w-full h-[90vh] flex items-center justify-center text-gray-500">
				Loading expenses...
			</div>
		);
	}
	return (
		<div className="w-full h-full flex">
			<div className="w-full h-[90vh] flex flex-col">
				<div className="bg-white dark:bg-[#1c1c1e] flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-gray-300 dark:border-gray-700">
					<div className="flex items-center gap-3 flex-wrap">
						<div className="text-sm font-semibold">Show Categories:</div>
						<div className="flex gap-2 flex-wrap">
							{allCategories.map((cat) => {
								const active =
									!selectedCategories || selectedCategories.includes(cat);
								return (
									<button
										key={cat}
										onClick={() => toggleCategory(cat)}
										className={`px-3 py-1 rounded-full text-sm border ${
											active
												? "bg-blue-600 text-white border-blue-600"
												: "bg-white dark:bg-[#1c1c1e] text-gray-700 border-gray-300 dark:border-gray-700"
										}`}
									>
										{cat}
									</button>
								);
							})}
							<button
								onClick={resetCategories}
								className="px-3 py-1 rounded-full text-sm border bg-gray-100 dark:bg-gray-700"
							>
								Reset
							</button>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<select
							value={rangePreset}
							onChange={(e) => setRangePreset(e.target.value as any)}
							className="px-3 py-1 border rounded bg-white dark:bg-[#1c1c1e]"
						>
							<option value="this_month">This month</option>
							<option value="last_3_months">Last 3 months</option>
							<option value="this_year">This year</option>
							<option value="all_time">All time</option>
							<option value="custom">Custom</option>
						</select>
						{rangePreset === "custom" && (
							<div className="flex items-center gap-2">
								<input
									type="date"
									value={customFrom}
									onChange={(e) => setCustomFrom(e.target.value)}
									className="px-2 py-1 border rounded bg-white dark:bg-[#1c1c1e]"
								/>
								<span className="text-sm">to</span>
								<input
									type="date"
									value={customTo}
									onChange={(e) => setCustomTo(e.target.value)}
									className="px-2 py-1 border rounded bg-white dark:bg-[#1c1c1e]"
								/>
							</div>
						)}
					</div>
				</div>
				{/* MAIN CONTENT */}
				<div className="p-6 h-full flex flex-col gap-y-10 overflow-auto">
					<ExpensesChartCard
						totalSpending={totalSpending}
						filteredCount={filtered.length}
						dateFrom={format(dateRange.from, "yyyy-MM-dd")}
						dateTo={format(dateRange.to, "yyyy-MM-dd")}
						chartData={chartData}
					/>
					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow p-4 border border-gray-300 dark:border-gray-700">
							<div className="text-sm text-muted-foreground">
								Average Monthly
							</div>
							<div className="text-xl font-bold">
								${stats.avgMonthly.toFixed(2)}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								Based on {stats.months} month(s)
							</div>
						</div>
						<div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow p-4 border border-gray-300 dark:border-gray-700">
							<div className="text-sm text-muted-foreground">Average Daily</div>
							<div className="text-xl font-bold">
								${stats.avgDaily.toFixed(2)}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								Over {stats.days} day(s)
							</div>
						</div>
						<div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow p-4 border border-gray-300 dark:border-gray-700">
							<div className="text-sm text-muted-foreground">Top Category</div>
							<div className="text-xl font-bold">{stats.mostSpentCategory}</div>
							<div className="text-xs text-gray-500 mt-1">
								Highest spending category
							</div>
						</div>
						<div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow p-4 border border-gray-300 dark:border-gray-700">
							<div className="text-sm text-muted-foreground">
								Largest Outflow
							</div>
							{stats.largestOutflow ? (
								<div>
									<div className="text-xl font-bold">
										${stats.largestOutflow.amount.toFixed(2)}
									</div>
									<div className="text-sm mt-1">
										{stats.largestOutflow.title} •{" "}
										{stats.largestOutflow.category}
									</div>
								</div>
							) : (
								<div className="text-xl font-bold">—</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Right Side Panel */}
			<div className="w-[35vw] h-[90vh] border-l border-gray-300 dark:border-gray-700">
				<div className="bg-white dark:bg-[#1c1c1e] p-4 h-full flex flex-col">
					<div className="text-lg font-bold mb-3">Transactions</div>
					<div className="text-sm text-gray-500 mb-3">
						Most spent at top — filtered by selected range/categories
					</div>
					<div className="flex-1 overflow-y-auto space-y-3">
						{sideItems.length === 0 && (
							<div className="text-sm text-gray-500">No transactions</div>
						)}
						{sideItems.map((t) => (
							<div
								key={t.id}
								className="flex justify-between items-start gap-3 p-3 rounded border border-gray-100 dark:border-gray-700"
							>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<div className="text-sm font-semibold">{t.title}</div>
										<div className="text-xs text-gray-500">
											• {t.category}
										</div>
									</div>
									<div className="text-xs text-gray-500 mt-1">
										{format(parseISO(t.date), "yyyy-MM-dd")}
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-bold">
										${t.amount.toFixed(2)}
									</div>
									<div className="text-xs text-gray-400 mt-1">
										{t.notes || "—"}
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
						<div className="flex justify-between text-sm text-gray-600">
							<div>Total</div>
							<div className="font-bold">${totalSpending.toFixed(2)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
