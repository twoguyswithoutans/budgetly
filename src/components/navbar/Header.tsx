"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Landmark } from "lucide-react";
import { format, addMonths, subMonths, isAfter, startOfMonth } from "date-fns";
import { usePathname } from "next/navigation";

interface HeaderProps {
	triggerRefresh?: number;
	onMonthChange?: (month: Date) => void;
}

export default function Header({ triggerRefresh = 0, onMonthChange }: Readonly<HeaderProps>) {
	const [open, setOpen] = useState(false);
	const popupRef = useRef<HTMLDivElement | null>(null);
	const [netWorth, setNetWorth] = useState<number>(0);
	const [amount, setAmount] = useState<number>(0);
	const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
	const pathname = usePathname();
	const showMonthNavigationSection = ["/"].includes(pathname);

	const titles: Record<string, string> = {
		"/": "Dashboard",
		"/expenses": "Expenses",
		"/goals": "Goals",
	};

	const title =
		titles[pathname] ||
		pathname
			.replace("/", "")
			.replace("-", " ")
			.replaceAll(/\b\w/g, (c) => c.toUpperCase()) ||
		"App";

	const localizeNumber = (number: number) =>
		number.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const fetchNetWorth = async () => {
		const { data, error } = await supabase.from("net_worth").select("amount").limit(1).single();
		if (error) console.error("Error fetching net worth:", error);
		else if (data) setNetWorth(data.amount);
	};

	useEffect(() => {
		fetchNetWorth();
	}, []);

	useEffect(() => {
		if (triggerRefresh > 0) fetchNetWorth();
	}, [triggerRefresh]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentAmount = Number.parseFloat(e.target.value);
		setAmount(Number.isNaN(currentAmount) ? 0 : currentAmount);
	};

	async function updateNetWorth() {
		const { data, error } = await supabase
			.from("net_worth")
			.select("id, amount")
			.limit(1)
			.single();

		if (error || !data) {
			console.error("Error fetching net worth:", error);
			return;
		}

		const newAmount = amount;
		const { error: updateError } = await supabase
			.from("net_worth")
			.update({ amount: newAmount, updated_at: new Date() })
			.eq("id", data.id);

		if (updateError) console.error("Error updating net worth:", updateError);
		else setNetWorth(newAmount);

		setOpen(false);
	}

	const handlePreviousMonth = () => {
		const newMonth = subMonths(currentMonth, 1);
		setCurrentMonth(newMonth);
		onMonthChange?.(newMonth);
	};

	const handleNextMonth = () => {
		const nextMonth = addMonths(currentMonth, 1);
		if (!isAfter(nextMonth, startOfMonth(new Date()))) {
			setCurrentMonth(nextMonth);
			onMonthChange?.(nextMonth);
		}
	};

	const formattedMonth = format(currentMonth, "MMMM yyyy");

	return (
		<div className="fixed top-0 w-full flex flex-col bg-white dark:bg-[#1c1c1e] border-b border-gray-300 dark:border-gray-700 z-50">

			<div className="w-screen md:w-[80vw] h-[10svh] border-b border-gray-300 dark:border-gray-700 flex justify-between items-center px-6">
				<div>
					<div className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">{title}</div>
				</div>
				<div className="hidden md:flex">
					{/* Month navigation */}
					{showMonthNavigationSection && (
						<div className="flex items-center gap-2">
							<button
								onClick={handlePreviousMonth}
								className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
							>
								<ChevronLeft size={25} />
							</button>

							<span className="text-gray-800 dark:text-gray-200 text-sm md:text-base font-semibold">{formattedMonth}</span>

							<button
								onClick={handleNextMonth}
								disabled={isAfter(addMonths(currentMonth, 1), startOfMonth(new Date()))}
								className={`p-2 rounded transition ${
									isAfter(addMonths(currentMonth, 1), startOfMonth(new Date()))
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-gray-200 dark:hover:bg-gray-700"
								}`}
							>
								<ChevronRight size={25} />
							</button>
						</div>
					)}
				</div>

				{/* Net worth popup */}
				<div className="relative">
					<div className="h-full flex items-center">
						<button
							onClick={() => setOpen(!open)}
							className="px-4 py-3 rounded flex justify-center items-center gap-x-2 text-sm text-white bg-[#294a6f]"
						>
							<div className="hidden md:grid">
								<Landmark size={25} />
							</div>
							<div className="flex md:flex-col gap-x-2 text-background">
								<div className="text-white">Net Worth:</div>
								<span className="text-white font-bold">${localizeNumber(netWorth ?? 0)}</span>
							</div>
						</button>
					</div>

					{open && (
						<div
							ref={popupRef}
							className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-4"
						>
							<div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
								Update Net Worth
							</div>
							<input
								type="number"
								placeholder="Enter amount"
								name="netWorth"
								defaultValue={netWorth}
								onChange={handleChange}
								className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2d] dark:text-white"
							/>
							<div className="flex justify-end gap-2">
								<button
									onClick={() => setOpen(false)}
									className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
								>
									Cancel
								</button>
								<button
									onClick={() => updateNetWorth()}
									className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
								>
									Assign
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* Month navigation mobile view */}
			{showMonthNavigationSection && (
				<div className="h-[5svh] flex justify-center items-center md:hidden">
						<div className="flex items-center gap-2">
							<button
								onClick={handlePreviousMonth}
								className="p-2 rounded"
							>
								<ChevronLeft size={20} />
							</button>

							<span className="text-gray-800 dark:text-gray-200 text-sm md:text-base font-semibold">{formattedMonth}</span>

							<button
								onClick={handleNextMonth}
								disabled={isAfter(addMonths(currentMonth, 1), startOfMonth(new Date()))}
								className={`p-2 rounded transition ${
									isAfter(addMonths(currentMonth, 1), startOfMonth(new Date()))
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
							>
								<ChevronRight size={20} />
							</button>
						</div>
				</div>
			)}
		</div>
	);
}
