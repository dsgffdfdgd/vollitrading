"use client"

import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, DollarSign, Wallet, TrendingUp, Activity, RefreshCw } from "lucide-react"
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
        recentActivity: [] as any[]
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/user/dashboard?t=${Date.now()}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                console.log("Dashboard Data Fetched:", data);
                setDashboardData(data)
                setLastUpdated(new Date())
            }
        } catch (e) {
            toast.error("Failed to load dashboard data")
        } finally {
            setIsLoading(false)
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>
                            Live equity curve tracking your allocated capital performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart />
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
