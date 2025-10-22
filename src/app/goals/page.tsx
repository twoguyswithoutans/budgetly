'use client';
import { useState } from 'react';
import Header from 'navbar/Header'
import GoalsContent from 'components/goals/GoalsContent'

export default function Page() {
    const [triggerRefresh, setTriggerRefresh] = useState(0);
    return (
        <div className="w-full h-full">
            <Header triggerRefresh={triggerRefresh} />
            <div className="w-full h-[90vh]">
                <GoalsContent onTriggerRefresh={() => setTriggerRefresh(prev => prev + 1)} />
            </div>
        </div>
    )
}