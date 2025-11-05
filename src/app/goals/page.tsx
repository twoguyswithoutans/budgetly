'use client';
import { useState } from "react";
import Header from "navbar/Header"
import GoalsContent from "goals/GoalsContent";

export default function Page() {
    const [triggerRefresh, setTriggerRefresh] = useState(0);
    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col">
                <div className="h-[10vh]">
                    <Header triggerRefresh={triggerRefresh} />
                </div>
                <div className="h-fit flex-1">
                    <GoalsContent onTriggerRefresh={() => setTriggerRefresh(prev => prev + 1)} />
                </div>
            </div>
        </div>
    )
}