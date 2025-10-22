"use client";
import { useState } from "react";
import Header from "navbar/Header";
import DashboardContent from "dashboard/DashboardContent";

export default function Page() {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div className="w-full h-full">
			<Header
				triggerRefresh={refreshKey}
				onMonthChange={(month: any) => setCurrentMonth(month)}
			/>
			<DashboardContent
				onTriggerRefresh={() => setRefreshKey((prev) => prev + 1)}
				currentMonth={currentMonth}
			/>
		</div>
	);
}