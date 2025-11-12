"use client";
import { useState } from "react";
import Header from "@navbar/Header";
import GoalsContent from "@goals/GoalsContent";

export default function Page() {
    const [triggerRefresh, setTriggerRefresh] = useState(0);
    const handleRefresh = () => setTriggerRefresh((prev) => prev + 1);

    return (
        <main className="flex flex-col h-full flex-1">
			<header className="h-[10vh]">
				<Header triggerRefreshAction={triggerRefresh} />
			</header>
			<section className="flex-1 overflow-y-auto">
				<GoalsContent onTriggerRefreshAction={handleRefresh} />
			</section>
		</main>
    )
}