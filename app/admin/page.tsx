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
    const [pooledCapital, setPooledCapital] = useState(2400000)
    const [profitInput, setProfitInput] = useState("")

    // Transaction Management State
    const [transactions, setTransactions] = useState<any[]>([])

    useEffect(() => {
        fetchDeposits()
    }, [])

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
            {/* Same Sidebar ... */}
            <div className="w-64 border-r border-gray-800 p-6 space-y-4">
                <h1 className="text-xl font-bold mb-8">VOLLIFX ADMIN</h1>
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-emerald-400 bg-emerald-400/10">Dashboard</Button>
                </Link>
                {/* ... */}
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                {/* ... Cards ... */}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* ... Profit Mgmt ... */}
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

                    {/* REAL Pending Deposits */}
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
                </div>
            </div>
        </div>
    )
}
