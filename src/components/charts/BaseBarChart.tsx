import { ChartDataProps } from "@models";
import { EmptyState } from "@emptyStates/EmptyState";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BaseBarChart({ chartData, otherData, comparison }: Readonly<ChartDataProps>) {
    const COLORS = ["#4F46E5", "#EF4444", "#F59E0B", "#60A5FA"];


    if(comparison) {
        return (
            <div className="h-[320px] w-full flex justify-center items-center overflow-auto text-black">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={otherData}
                            margin={{ top: 20, right: 30, bottom: 0, left: 0 }}
                        >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyState message="data" graph={true} />
                )}
            </div>
        )
    }
    return (
        <div className="h-[320px] w-full flex justify-center items-center overflow-auto text-black">
            {chartData.length > 0 ? (
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
                            {chartData.map((entry, index) => (
                                <Cell key={entry.name + index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <EmptyState message="data" graph={true} />
            )}
        </div>
    )
}