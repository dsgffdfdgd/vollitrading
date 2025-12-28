"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, DollarSign, TrendingUp, Settings } from "lucide-react"

import { toast } from "sonner"
import { useState, useEffect } from "react"

export default function AdminPage() {
    // Profit Management State
    const [stats, setStats] = useState({ activeTraders: 1240, pooledCapital: 2400000 })
    const [profitInput, setProfitInput] = useState("")

    // Transaction & User Management State
    const [transactions, setTransactions] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        fetchDeposits()
        fetchStats()
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?t=${Date.now()}`)
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/admin/stats?t=${Date.now()}`)
            if (res.ok) {
                const data = await res.json()
                setStats({
                    activeTraders: data.activeTraders || 1240,
                    pooledCapital: data.pooledCapital || 2400000
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateStats = async () => {
        try {
            const res = await fetch('/api/admin/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stats)
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Platform stats updated globally!")
            } else {
                toast.error(data.error || "Failed to update stats")
            }
        } catch (e) {
            toast.error("Network error")
        }
    }

    const fetchDeposits = async () => {
        try {
            const res = await fetch(`/api/admin/deposits?t=${Date.now()}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setTransactions(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleApplyProfit = async () => {
        if (!profitInput) return
        const percentage = parseFloat(profitInput)

        const loadingToast = toast.loading(`Applying ${percentage}% profit...`)

        try {
            const res = await fetch('/api/admin/profit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ percentage })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(data.message, { id: loadingToast })
                setProfitInput("")
            } else {
                toast.error(data.error || "Failed to apply profit", { id: loadingToast })
            }
        } catch (e) {
            toast.error("Network error", { id: loadingToast })
        }
    }

    const handleApplyLoss = async () => {
        if (!profitInput) return
        let percentage = parseFloat(profitInput)
        // Ensure negative
        if (percentage > 0) percentage = -percentage

        const loadingToast = toast.loading(`Applying ${percentage}% loss...`)

        try {
            const res = await fetch('/api/admin/profit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ percentage })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(data.message, { id: loadingToast })
                setProfitInput("")
            } else {
                toast.error(data.error || "Failed to apply loss", { id: loadingToast })
            }
        } catch (e) {
            toast.error("Network error", { id: loadingToast })
        }
    }

    const handleApprove = async (id: string, amount: number) => {
        const loadingToast = toast.loading("Approving deposit...")
        try {
            const res = await fetch('/api/admin/deposits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId: id, action: 'APPROVE' })
            })

            if (res.ok) {
                toast.success(`Deposit of $${amount} approved!`, { id: loadingToast })
                fetchDeposits() // Refresh list
            } else {
                toast.error("Failed to approve", { id: loadingToast })
            }
        } catch (e) {
            toast.error("Network error", { id: loadingToast })
        }
    }

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            <div className="w-64 border-r border-gray-800 p-6 space-y-4">
                <h1 className="text-xl font-bold mb-8">VOLLIFX ADMIN</h1>
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-emerald-400 bg-emerald-400/10">Dashboard</Button>
                </Link>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Platform Stats Management */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle>Platform Stats</CardTitle>
                            <CardDescription>Update global counters shown on landing page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Active Traders</label>
                                    <Input
                                        type="number"
                                        value={stats.activeTraders}
                                        onChange={(e) => setStats({ ...stats, activeTraders: Number(e.target.value) })}
                                        className="bg-black border-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Pooled Capital ($)</label>
                                    <Input
                                        type="number"
                                        value={stats.pooledCapital}
                                        onChange={(e) => setStats({ ...stats, pooledCapital: Number(e.target.value) })}
                                        className="bg-black border-gray-700"
                                    />
                                </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpdateStats}>
                                Update Stats
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profit Mgmt */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle>Trading Performance Management</CardTitle>
                            <CardDescription>Set the daily profit/loss percentage for the pool.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    placeholder="Enter % (e.g. 1.2 or -0.5)"
                                    className="bg-black border-gray-700"
                                    value={profitInput}
                                    onChange={(e) => setProfitInput(e.target.value)}
                                />
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApplyProfit}>Apply Profit</Button>
                                <Button variant="destructive" onClick={handleApplyLoss}>Apply Loss</Button>
                            </div>
                            <p className="text-sm text-muted-foreground">This will update all user equities allocated to the active pool.</p>
                        </CardContent>
                    </Card>

                    {/* Pending Deposits */}
                    <Card className="bg-gray-900 border-gray-800 col-span-1 border-l-4 border-l-emerald-500">
                        {/* ... existing content ... */}
                    </Card>

                    {/* User Wallets Oversight */}
                    <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                        <CardHeader>
                            <CardTitle>User Wallets Oversight</CardTitle>
                            <CardDescription>View all registered users and their current portfolio status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-gray-800">
                                        <tr>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Joined</th>
                                            <th className="px-4 py-3 text-right">Main Wallet</th>
                                            <th className="px-4 py-3 text-right">Trading Pool</th>
                                            <th className="px-4 py-3 text-right">Profit Balance</th>
                                            <th className="px-4 py-3 text-right text-emerald-400">Total Equity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No users found</td>
                                            </tr>
                                        ) : (
                                            users.map((user: any) => {
                                                const totalEquity = (user.wallet.mainBalance + user.wallet.tradingBalance + user.wallet.profitBalance);
                                                return (
                                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium text-white">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-400">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono">
                                                            ${user.wallet.mainBalance.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono text-blue-400">
                                                            ${user.wallet.tradingBalance.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono text-emerald-400">
                                                            ${user.wallet.profitBalance.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-white">
                                                            ${totalEquity.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
