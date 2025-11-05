"use client";
import { useState } from "react";
import Header from "navbar/Header";
import DashboardContent from "dashboard/DashboardContent";
import DashboardToolbar from "dashboard/DashboardToolbar";
import DashboardTitleBar from "dashboard/DashboardTitleBar";

export default function Page() {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div className="flex h-full">
			<div className="flex-1 flex flex-col">
				<div className="h-[15svh] md:h-[10svh]">
					<Header
						triggerRefresh={refreshKey}
						onMonthChange={(month: any) => setCurrentMonth(month)}
					/>
				</div>
				<div className="h-[75svh] md:h-[90svh] flex-1">
					<DashboardContent
						onTriggerRefresh={() => setRefreshKey((prev) => prev + 1)}
						currentMonth={currentMonth}
					/>
				</div>
			</div>
		</div>
	);
}