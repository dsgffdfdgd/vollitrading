"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const defaultMonthlyData = [
    { name: 'Jan', profit: 4.2 },
    { name: 'Feb', profit: 3.8 },
    { name: 'Mar', profit: -1.2 },
    { name: 'Apr', profit: 5.5 },
    { name: 'May', profit: 2.1 },
    { name: 'Jun', profit: 6.8 },
]

export default function PerformancePage() {
    const [metrics, setMetrics] = useState({
        totalReturn: "+124.5%",
        sharpeRatio: "1.84",
        maxDrawdown: "-5.2%",
        winRate: "68%",
        monthlyReturns: defaultMonthlyData
    })

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch('/api/user/dashboard');
                const data = await res.json();

                if (data.performanceMetrics) {
                    // Check if it's a string (which it might be if it comes from JSONB raw query sometimes) or object
                    const perf = typeof data.performanceMetrics === 'string'
                        ? JSON.parse(data.performanceMetrics)
                        : data.performanceMetrics;

                    setMetrics({
                        totalReturn: perf.totalReturn || "+124.5%",
                        sharpeRatio: perf.sharpeRatio || "1.84",
                        maxDrawdown: perf.maxDrawdown || "-5.2%",
                        winRate: perf.winRate || "68%",
                        monthlyReturns: perf.monthlyReturns || defaultMonthlyData
                    })
                }
            } catch (error) {
                console.error("Failed to load performance metrics", error)
            }
        }

        fetchMetrics();
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Trading Performance</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{metrics.totalReturn}</div>
                        <p className="text-xs text-muted-foreground">Inception to Date</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.sharpeRatio}</div>
                        <p className="text-xs text-muted-foreground">Risk-Adjusted Return</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{metrics.maxDrawdown}</div>
                        <p className="text-xs text-muted-foreground">Peak to Trough</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.winRate}</div>
                        <p className="text-xs text-muted-foreground">Profitable Trades</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Returns</CardTitle>
                    <CardDescription>Historical performance breakdown by month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.monthlyReturns}>
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                                    itemStyle={{ color: "#e5e7eb" }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
