"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

export interface ChartDataPoint {
    date: string;
    value: number;
}

interface OverviewChartProps {
    data?: ChartDataPoint[];
}



export function OverviewChart({ data }: OverviewChartProps) {
    // Default fallback if no data provided
    const displayData = data && data.length > 0 ? data : [
        { date: "Mon", value: 0 },
        { date: "Tue", value: 0 },
        { date: "Wed", value: 0 },
        { date: "Thu", value: 0 },
        { date: "Fri", value: 0 },
        { date: "Sat", value: 0 },
        { date: "Sun", value: 0 },
    ]

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={displayData}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    domain={['auto', 'auto']}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                    itemStyle={{ color: "#e5e7eb" }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
