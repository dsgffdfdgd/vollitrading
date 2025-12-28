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
    const [stats, setStats] = useState({ activeTraders: 1240, pooledCapital: 2400000, activeTradingDisplay: 0 })
    const [profitInput, setProfitInput] = useState("")

    // Transaction & User Management State
    const [transactions, setTransactions] = useState<any[]>([])
    const [withdrawals, setWithdrawals] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])

    // Edit User Wallet State
    const [editingUser, setEditingUser] = useState<any>(null)
    const [editForm, setEditForm] = useState({ mainBalance: 0, tradingBalance: 0, profitBalance: 0 })
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        fetchDeposits()
        fetchWithdrawals()
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
                    pooledCapital: data.pooledCapital || 2400000,
                    activeTradingDisplay: data.activeTradingDisplay || 0
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

    const fetchWithdrawals = async () => {
        try {
            const res = await fetch(`/api/admin/withdrawals?t=${Date.now()}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setWithdrawals(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleProcessWithdrawal = async (id: string, action: 'APPROVE' | 'REJECT') => {
        const loadingToast = toast.loading(`${action === 'APPROVE' ? 'Approving' : 'Rejecting'} withdrawal...`)
        try {
            const res = await fetch('/api/admin/withdrawals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId: id, action })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(data.message, { id: loadingToast })
                fetchWithdrawals()
            } else {
                toast.error(data.error || "Process failed", { id: loadingToast })
            }
        } catch (e) {
            toast.error("Network error", { id: loadingToast })
        }
    }

    const startEditUser = (user: any) => {
        setEditingUser(user)
        setEditForm({
            mainBalance: user.wallet.mainBalance,
            tradingBalance: user.wallet.tradingBalance,
            profitBalance: user.wallet.profitBalance
        })
        setIsEditOpen(true)
    }

    const handleUpdateWallet = async () => {
        if (!editingUser) return

        const loadingToast = toast.loading("Updating wallet...")
        try {
            const res = await fetch('/api/admin/users/update-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: editingUser.id,
                    ...editForm
                })
            })

            if (res.ok) {
                toast.success("Wallet updated successfully", { id: loadingToast })
                setIsEditOpen(false)
                fetchUsers() // Refresh list
            } else {
                toast.error("Failed to update wallet", { id: loadingToast })
            }
        } catch (e) {
            toast.error("Network error", { id: loadingToast })
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
        <div className="flex h-screen bg-gray-950 text-white relative">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Active Traders (Global)</label>
                                <Input
                                    type="number"
                                    value={stats.activeTraders}
                                    onChange={(e) => setStats({ ...stats, activeTraders: Number(e.target.value) })}
                                    className="bg-black border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Pooled Capital (Global)</label>
                                <Input
                                    type="number"
                                    value={stats.pooledCapital}
                                    onChange={(e) => setStats({ ...stats, pooledCapital: Number(e.target.value) })}
                                    className="bg-black border-gray-700"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs text-emerald-400 font-bold">Allocated to Pool A (User Dashboard Display)</label>
                                <Input
                                    type="number"
                                    value={stats.activeTradingDisplay}
                                    onChange={(e) => setStats({ ...stats, activeTradingDisplay: Number(e.target.value) })}
                                    className="bg-black border-emerald-500/50"
                                    placeholder="Amount to show on every user's 'Active Trading' card"
                                />
                                <p className="text-[10px] text-gray-500">This value will appear on EVERY user's dashboard as their 'Active Trading' amount.</p>
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
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Pending Deposits</span>
                            <span className="text-sm font-normal text-gray-400">{transactions.length} Request(s)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {transactions.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">No pending deposits</div>
                            ) : (
                                transactions.map((tx) => (
                                    <div key={tx.id} className="flex flex-col gap-2 p-3 bg-black/40 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold text-white">{tx.wallet?.user?.name || "Unknown User"}</div>
                                                <div className="text-xs text-gray-400">{tx.wallet?.user?.email}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-emerald-400">+${tx.amount.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(tx.id, tx.amount)}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-950/30">
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Withdrawals */}
                <Card className="bg-gray-900 border-gray-800 col-span-1 border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Pending Withdrawals</span>
                            <span className="text-sm font-normal text-gray-400">{withdrawals.length} Request(s)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {withdrawals.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">No pending withdrawals</div>
                            ) : (
                                withdrawals.map((tx) => (
                                    <div key={tx.id} className="flex flex-col gap-2 p-3 bg-black/40 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold text-white">{tx.wallet?.user?.name || "Unknown User"}</div>
                                                <div className="text-xs text-gray-400">{tx.reference}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-orange-400">-${tx.amount.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleProcessWithdrawal(tx.id, 'APPROVE')}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-950/30" onClick={() => handleProcessWithdrawal(tx.id, 'REJECT')}>
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
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
                                        <th className="px-4 py-3 text-right">Main Wallet</th>
                                        <th className="px-4 py-3 text-right">Active Trading (Pool A)</th>
                                        <th className="px-4 py-3 text-right">Profit Balance</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found</td>
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
                                                    <td className="px-4 py-3 text-right font-mono">
                                                        ${user.wallet.mainBalance.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono text-blue-400">
                                                        ${user.wallet.tradingBalance.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono text-emerald-400">
                                                        ${user.wallet.profitBalance.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button size="sm" variant="outline" className="h-8 shadow-sm" onClick={() => startEditUser(user)}>Edit</Button>
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

            {/* Edit User Dialog */ }
    {
        isEditOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-2xl">
                    <CardHeader>
                        <CardTitle>Edit User Wallet</CardTitle>
                        <CardDescription>Manually adjust balances for {editingUser?.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Main Wallet Balance</label>
                            <Input
                                type="number"
                                value={editForm.mainBalance}
                                onChange={(e) => setEditForm({ ...editForm, mainBalance: parseFloat(e.target.value) })}
                                className="bg-black border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Active Trading (Pool A)</label>
                            <Input
                                type="number"
                                value={editForm.tradingBalance}
                                onChange={(e) => setEditForm({ ...editForm, tradingBalance: parseFloat(e.target.value) })}
                                className="bg-black border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Profit Balance</label>
                            <Input
                                type="number"
                                value={editForm.profitBalance}
                                onChange={(e) => setEditForm({ ...editForm, profitBalance: parseFloat(e.target.value) })}
                                className="bg-black border-gray-700"
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleUpdateWallet}>Save Changes</Button>
                            <Button className="flex-1" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
        </div >
    )
}

