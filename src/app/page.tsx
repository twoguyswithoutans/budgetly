"use client";
import { useState } from "react";
import Header from "@navbar/Header";
import DashboardContent from "@dashboard/DashboardContent";

export default function Page() {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [refreshKey, setRefreshKey] = useState(0);

	const handleMonthChange = (month: Date) => setCurrentMonth(month);
	const handleRefresh = () => setRefreshKey((prev) => prev + 1);

	return (
		<main className="flex flex-col h-full flex-1">
			<header className="h-[15svh] md:h-[10svh]">
				<Header
					triggerRefresh={refreshKey}
					onMonthChange={handleMonthChange}
				/>
			</header>

			<section className="flex-1 overflow-y-auto">
				<DashboardContent
					onTriggerRefreshAction={handleRefresh}
					currentMonth={currentMonth}
				/>
			</section>
		</main>
	)
}