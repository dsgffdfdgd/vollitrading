"use client"

import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, DollarSign, Wallet, TrendingUp, Activity, RefreshCw, Globe, Calendar, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function DashboardPage() {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [dashboardData, setDashboardData] = useState({
        walletId: "",
        equity: 0,
        activeTrading: 0,
        profit: 0,
        mainBalance: 0,
        recentActivity: [] as any[],
        chartData: [] as any[],
        sentimentData: null as any
    })
    const [isLoading, setIsLoading] = useState(true)

    const [news, setNews] = useState<any[]>([])
    const [isLoadingNews, setIsLoadingNews] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            // Fetch Dashboard Data
            const res = await fetch(`/api/user/dashboard?t=${Date.now()}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setDashboardData(data)
                setLastUpdated(new Date())
            }

            // Fetch News Data
            setIsLoadingNews(true)
            const newsRes = await fetch('/api/news', { next: { revalidate: 300 } })
            if (newsRes.ok) {
                const newsData = await newsRes.json()
                if (Array.isArray(newsData)) {
                    setNews(newsData)
                }
            }
        } catch (e) {
            toast.error("Failed to load dashboard data")
        } finally {
            setIsLoading(false)
            setIsLoadingNews(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchData()
        toast.success("Dashboard data updated")
    }

    // Default sentiment if none provided
    const defaultSentiment = [
        { symbol: "XAUUSD (Gold)", sentiment: 65, type: "Bullish" },
        { symbol: "EURUSD", sentiment: 58, type: "Bearish" }
    ];

    let displaySentiment = defaultSentiment;

    if (dashboardData.sentimentData) {
        if (Array.isArray(dashboardData.sentimentData)) {
            displaySentiment = dashboardData.sentimentData;
        } else if (typeof dashboardData.sentimentData === 'string') {
            try {
                const parsed = JSON.parse(dashboardData.sentimentData);
                if (Array.isArray(parsed)) {
                    displaySentiment = parsed;
                }
            } catch (e) {
                console.error("Failed to parse sentiment data:", e);
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">****</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Hidden for privacy
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Trading</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${dashboardData.activeTrading.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Allocated to Pool A
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Wallet</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${dashboardData.profit.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available to withdraw
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Main Wallet</CardTitle>
                        <Wallet className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-3">${dashboardData.mainBalance.toFixed(2)}</div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Button className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => window.location.href = '/dashboard/wallet?tab=deposit'}>
                                Deposit
                            </Button>
                            <Button variant="outline" className="h-8 text-xs" onClick={() => window.location.href = '/dashboard/wallet?tab=withdraw'}>
                                Withdraw
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground/30 font-mono">ID: {dashboardData.walletId}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Live Market Widgets */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Session Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Forex Sessions</CardTitle>
                        <Globe className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-col items-center">
                                <div className="text-xs text-muted-foreground mb-1">Sydney/Tokyo</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                    Closed
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-xs text-muted-foreground mb-1">London</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
                                    Open
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-xs text-muted-foreground mb-1">New York</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    Pre-market
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Economic Calendar Highlights */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Economic Calendar</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="h-[150px] overflow-hidden relative">
                        {/* Dynamic News List */}
                        <div className="space-y-3 mt-2">
                            {news.length > 0 ? (
                                news.map((item: any, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-muted-foreground w-12">{item.time}</span>
                                            <div className="flex flex-col">
                                                <span className="font-medium truncate max-w-[120px]">{item.title}</span>
                                                <span className="text-[10px] text-muted-foreground">{item.country}</span>
                                            </div>
                                        </div>
                                        <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 text-[10px] uppercase font-bold">
                                            {item.impact}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs">
                                    {isLoadingNews ? "Loading news..." : "No high impact news today"}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Market Sentiment */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                        <BarChart className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-2">
                            {displaySentiment.map((item: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium">{item.symbol}</span>
                                        <span className={item.type === 'Bullish' ? "text-emerald-500" : "text-red-500"}>{item.sentiment}% {item.type}</span>
                                    </div>
                                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.type === 'Bullish' ? "bg-emerald-500" : "bg-red-500"} rounded-full`} style={{ width: `${item.sentiment}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>
                            Live equity curve tracking your allocated capital performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={dashboardData.chartData} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest transactions and trading results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {dashboardData.recentActivity.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <Activity className="h-8 w-8 mb-2 opacity-50" />
                                    <p>No recent activity</p>
                                </div>
                            ) : (
                                dashboardData.recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.date}</p>
                                        </div>
                                        <div className={`ml-auto font-medium ${item.type === 'deposit' || item.type === 'profit' ? 'text-emerald-500' : 'text-foreground'}`}>
                                            {item.amount}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
