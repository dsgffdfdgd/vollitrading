"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, ArrowUpRight, Clock, DollarSign, Users } from "lucide-react"
import React, { useState, useEffect } from "react"


export default function LiveTradingPage() {
    const [pnl, setPnl] = useState(2.4)
    const [stats, setStats] = useState({ activeTraders: 1240, pooledCapital: 2400000 })
    const [trades, setTrades] = useState([
        { pair: "EUR/USD", type: "Long", entry: "1.0845", pnl: 0.45, current: 1.0890 },
        { pair: "GBP/JPY", type: "Short", entry: "182.30", pnl: 1.20, current: 180.12 },
        { pair: "XAU/USD", type: "Long", entry: "2045.50", pnl: -0.15, current: 2042.10 },
    ])
    const [allocatedCapital, setAllocatedCapital] = useState(0)
    const [exposure, setExposure] = useState("15%")
    const [nextSettlement, setNextSettlement] = useState("4h 32m")
    const [chartData, setChartData] = useState<any[] | undefined>(undefined)

    useEffect(() => {
        // Fetch user dashboard data (includes global stats)
        fetch('/api/user/dashboard')
            .then(res => res.json())
            .then(data => {
                // Set User-Specific Data
                if (data.activeTrading !== undefined) {
                    setAllocatedCapital(data.activeTrading)
                }

                // Global Stats (fallback defaults if missing in response, but usually present)
                // Note: user/dashboard might not return activeTraders/pooledCapital directly in root, 
                // but we can rely on defaults or update API. 
                // Actually, let's keep the /api/admin/stats fetch for global counters if needed, 
                // OR just accept that /api/user/dashboard returns liveTradingData.

                // Load Admin-Controlled Live Data
                if (data.liveTradingData) {
                    const liveData = typeof data.liveTradingData === 'string'
                        ? JSON.parse(data.liveTradingData)
                        : data.liveTradingData;

                    if (liveData.currentPnl !== undefined) setPnl(liveData.currentPnl);
                    if (liveData.activePositions) setTrades(liveData.activePositions);
                    if (liveData.masterPoolChart) setChartData(liveData.masterPoolChart);

                    if (liveData.exposure) setExposure(liveData.exposure);
                    if (liveData.nextSettlement) setNextSettlement(liveData.nextSettlement);
                }
            })
            .catch(err => console.error("Failed to fetch dashboard data", err))

        // Separate fetch for global counters (activeTraders, pooledCapital) if they are not in user dashboard
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.activeTraders) {
                    setStats({
                        activeTraders: data.activeTraders,
                        pooledCapital: data.pooledCapital
                    })
                }
            })
            .catch(e => null)
    }, [])

    // Simulate live market data only if no admin override (simplistic check, actually simulation runs on top for now)
    React.useEffect(() => {
        // We will keep the simulation for "aliveness" feeling, but it might overwrite admin data if we aren't careful.
        // For now, let's allow simulation to run "Micro-movements" on top of the base values.
        const interval = setInterval(() => {
            // Fluctuate main PNL slightly
            setPnl(prev => +(prev + (Math.random() * 0.02 - 0.01)).toFixed(2))

            // Fluctuate individual trades slightly
            setTrades(prevTrades => prevTrades.map(trade => ({
                ...trade,
                pnl: +(trade.pnl + (Math.random() * 0.01 - 0.005)).toFixed(2)
            })))
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Live Trading</h2>
                    <p className="text-muted-foreground">Monitor the active master pool performance in real-time.</p>
                </div>
                <div className="flex flex-wrap gap-4">

                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="font-semibold text-sm">Market Active</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Chart Area */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Master Pool Equity</CardTitle>
                        <CardDescription>Aggregate performance of all allocated capital.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <OverviewChart data={chartData} />
                        </div>
                    </CardContent>
                </Card>

                {/* Trade Info / Stats */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Current Pool PNL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold transition-colors duration-500 ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Today's Session
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Active Positions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {trades.map((trade, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-white/5 hover:bg-secondary/80 transition-colors">
                                    <div>
                                        <div className="font-bold">{trade.pair}</div>
                                        <div className={`text-xs ${trade.type === 'Long' ? 'text-emerald-500' : 'text-red-500'}`}>{trade.type} @ {trade.entry}</div>
                                    </div>
                                    <div className={`font-mono font-bold transition-colors duration-300 ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}%
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Allocation Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Your Allocated Capital</div>
                            <div className="text-2xl font-bold text-white">${allocatedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div className="h-12 w-px bg-white/10 hidden md:block" />
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Current Exposure</div>
                            <div className="text-2xl font-bold text-blue-400">{exposure}</div>
                        </div>
                        <div className="h-12 w-px bg-white/10 hidden md:block" />
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Next Settlement</div>
                            <div className="text-2xl font-bold text-orange-400">{nextSettlement}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
