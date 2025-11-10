import { useState, useEffect, useMemo } from "react";
import { Goal, GoalsContentProp } from "@models";
import { supabase } from "@/lib/supabaseClient";
import { EmptyState } from "@emptyStates/EmptyState";
import { useToast } from "@useToast";
import Loader from "@Loader";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Scroll, Edit, Trash2, CheckCircle, AlertTriangle, Wallet, CreditCard, Target } from "lucide-react";

export default function GoalsContent({ onTriggerRefresh }: Readonly<GoalsContentProp>) {
	const [loading, setLoading] = useState(true);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [addAmount, setAddAmount] = useState("");
	const completedGoals = goals.filter((g) => g.current >= g.target);
	const activeGoals = goals.filter((g) => g.current < g.target);
	const today = new Date();
	const COLORS = ["#22c55e", "#ef4444"];
	const { showToast } = useToast();

	useEffect(() => {
		const fetchGoals = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("categories")
				.select("id, name, items ( id, title, total, appliedAmount, dueDate )")
				.in("name", ["Savings", "Debt"]);

			if (error) {
				console.error("Error fetching goals:", error);
				showToast("Error fetching goals!", "error")
				setGoals([]);
				setLoading(false);
				return;
			}

			const mapped: Goal[] =
				(data || []).flatMap((cat) =>
					(cat.items || []).map((item) => ({
						id: item.id,
						type: cat.name === "Savings" ? "saving" : "debt",
						name: item.title ?? "",
						target: Number(item.total ?? 0),
						current: Number(item.appliedAmount ?? 0),
						due: item.dueDate ? String(item.dueDate) : "",
					}))
				);

			setGoals(mapped);
			setLoading(false);
		};

		fetchGoals();
	}, []);

	const handleAddProgress = async (id: string, amount: number) => {
		const goal = goals.find((g) => g.id === id);
		if (!goal) return;

		const newCurrent = Math.min(goal.current + amount, goal.target);

		const { error } = await supabase
			.from("items")
			.update({ appliedAmount: newCurrent })
			.eq("id", id);

		if(error) {
			console.error("Error updating progress:", error)
			showToast("Error updating progress!", "error")
			return;
		}
		setGoals((prev) =>
			prev.map((g) => (g.id === id ? { ...g, current: newCurrent } : g))
		)
		if(newCurrent >= goal.target) {
			showToast("Goal completed!", "info")
		}
		onTriggerRefresh();
	};

	const handleDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			console.error("Error deleting goal:", error)
			showToast("Error deleting goal!", "error")
			return;
		}
		setGoals((prev) => prev.filter((g) => g.id !== id));
		onTriggerRefresh();
		showToast("Goal deleted!", "success")
	};

	const handleAddAmount = async () => {
		if(!addAmount || isNaN(Number(addAmount)) || !editingGoal) return;

		const add = Number(addAmount);
		const newCurrent = Math.min(editingGoal.current + add, editingGoal.target);

		const { error } = await supabase
			.from("items")
			.update({ appliedAmount: newCurrent })
			.eq("id", editingGoal.id);

		if(error) {
			console.error("Error updating goal amount:", error);
			showToast("Error updating goal amount!", "error")
			return;
		}

		setGoals((prev) =>
			prev.map((g) =>
				g.id === editingGoal.id ? { ...g, current: newCurrent } : g
			)
		)

		if(newCurrent >= editingGoal.target) {
			showToast("Goal completed!", "info")
		}
		setAddAmount("");
		setEditingGoal(null);
		onTriggerRefresh();
	};

	const totalSavings = useMemo(
		() =>
			goals
				.filter((g) => g.type === "saving")
				.reduce((sum, g) => sum + g.current, 0),
		[goals]
	);

	const totalSavingsTarget = useMemo(
		() =>
			goals
				.filter((g) => g.type === "saving")
				.reduce((sum, g) => sum + g.target, 0),
		[goals]
	);

	const totalDebts = useMemo(
		() =>
			goals.filter((g) => g.type === "debt").reduce((sum, g) => sum + g.current, 0),
		[goals]
	);

	const totalDebtsTarget = useMemo(
		() =>
			goals.filter((g) => g.type === "debt").reduce((sum, g) => sum + g.target, 0),
		[goals]
	);

	const chartData = [
		{ name: "Savings", value: totalSavings },
		{ name: "Debts", value: totalDebts },
	];

	if(loading) {
		return (
			<Loader title="Goals" />
		)
	}

	if(goals.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400">
				<div className="text-4xl mb-3">
					<Scroll size={50} />
				</div>
				<div className="text-lg font-semibold">No goals yet</div>
				<div className="text-sm opacity-70 mb-4">No debt or savings goals added yet</div>
			</div>
		)
	}
	return (
		<div className="flex flex-col w-full h-[90svh] bg-background dark:bg-[#1c1c1e] text-foreground p-6 gap-6 overflow-auto pb-[10svh] md:pb-0">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Summary */}
				<div className="bg-white dark:bg-[#2a2a2d] rounded-xl shadow p-6 flex flex-col justify-start gap-y-3">
					<div className="text-2xl font-bold text-gray-800 dark:text-gray-100 pb-3">Summary</div>
					<div className=" text-gray-700 dark:text-gray-300">
						<div className="flex gap-x-2">
							<Wallet size={20} />
							Total Savings:
						</div>
						<div>
							${totalSavings.toFixed(2)} / ${totalSavingsTarget.toFixed(2)}
						</div>
					</div>
					<div className=" text-gray-700 dark:text-gray-300">
						<div className="flex gap-x-2">
							<CreditCard size={20} />
							Total Debt Paid:
						</div>
						<div>
							${totalDebts.toFixed(2)} / ${totalDebtsTarget.toFixed(2)}
						</div>
					</div>
					<div className="text-gray-700 dark:text-gray-300">
						<div className="flex gap-x-2">
							<Target size={20} />
							Goals Completed:
						</div>
						<div>
							{completedGoals.length} / {goals.length}
						</div>
					</div>
				</div>
				{/* Chart */}
				<div className="h-[320px] w-full bg-white dark:bg-[#2a2a2d] rounded-xl shadow flex justify-center items-center text-black">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={chartData}
							margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
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
								{chartData.map((_, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
			{/* Active Goals */}
			<div className="bg-white dark:bg-[#2a2a2d] rounded-xl shadow p-6">
				<div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Active Goals</div>
				{activeGoals.length > 0 ? (
					<div className="space-y-4">
						{activeGoals.map((goal) => {
							const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
							const due = goal.due ? new Date(goal.due) : null;
							const overdue = !!due && due < today && goal.type === "debt";
							const nearComplete = progress >= 80 && progress < 100;

							return (
								<div key={goal.id} className="border-b border-gray-300 dark:border-gray-700 pb-3">
									<div className="flex justify-between items-center mb-2">
										<div className="flex items-center gap-2">
											<span
												className={`text-sm font-semibold ${
													goal.type === "saving" ? "text-[#1c9247]" : "text-[#d33d3d]"
												}`}
											>
												{goal.name}
											</span>
											{overdue && (
												<span className="flex items-center gap-1 text-xs text-[#ef4444] font-medium">
													<AlertTriangle size={12} /> Overdue
												</span>
											)}
										</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											${goal.current} / ${goal.target}
										</div>
									</div>
									<div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-500 ${
												goal.type === "saving" ? "bg-[#22c55e]" : "bg-[#ef4444]"
											}`}
											style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
										/>
									</div>
									<div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
										<span>Due: {goal.due || "—"}</span>
										<div className="flex gap-2">
											<button
												onClick={() => handleAddProgress(goal.id, 100)}
												className="text-blue-500 hover:underline"
											>
												+ Add $100
											</button>
											<button
												onClick={() => setEditingGoal(goal)}
												className="text-gray-500 hover:text-gray-700"
											>
												<Edit size={14} />
											</button>
											{editingGoal?.id === goal.id && (
												<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
													<div className="bg-white dark:bg-[rgb(28,28,30)] p-6 rounded-xl w-80 shadow-lg">
														<h3 className="text-lg font-bold mb-4">Add Amount</h3>

														<div className="flex flex-col gap-3">
															<p className="text-sm font-medium">
																{editingGoal.name} ({editingGoal.type === "saving" ? "Saving" : "Debt"})
															</p>
															<label htmlFor="addAmount" className="text-sm font-semibold">Amount to Add</label>
															<input
																name="addAmount"
																type="number"
																value={addAmount}
																onChange={(e) => setAddAmount(e.target.value)}
																placeholder="Enter amount"
																className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
															/>
															<div className="flex justify-end gap-3 mt-4">
																<button
																	onClick={() => {
																		setAddAmount("");
																		setEditingGoal(null);
																	}}
																	className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
																>
																	Cancel
																</button>
																<button
																	onClick={handleAddAmount}
																	className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
																>
																	Add
																</button>
															</div>
														</div>
													</div>
												</div>
											)}
											<button
												onClick={() => handleDelete(goal.id)}
												className="text-[#ef4444] hover:text-[#c93a3a]"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</div>
									{nearComplete && (
										<div className="mt-2 text-xs text-green-600 flex items-center gap-1">
											<CheckCircle size={12} /> You're almost there!
										</div>
									)}
								</div>
							);
						})}
					</div>
				):
				(
					<EmptyState message="goals" graph={false} />
				)}
			</div>
			{/* Completed Goals */}
			{completedGoals.length > 0 && (
				<div className="bg-white dark:bg-[#2a2a2d] rounded-xl shadow p-6 mb-4">
					<div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Completed Goals</div>
					{completedGoals.map((goal) => (
						<div
							key={goal.id}
							className="flex justify-between items-center text-sm py-2 border-b border-gray-300 dark:border-gray-700"
						>
							<div className="flex items-center gap-2">
								<CheckCircle className="text-[#22c55e]" size={16} />
								<span>{goal.name}</span>
							</div>
							<div className="text-gray-500">${goal.target}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
