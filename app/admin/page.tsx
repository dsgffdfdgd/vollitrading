"use client"

import { Button } from "@/components/ui/button"
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



    // ... existing handlers ...

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {/* Same Sidebar ... */}
            <div className="w-64 border-r border-gray-800 p-6 space-y-4">
                <h1 className="text-xl font-bold mb-8">VOLLIFX ADMIN</h1>
                <Button variant="ghost" className="w-full justify-start text-emerald-400 bg-emerald-400/10">Dashboard</Button>
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
                    {/* Pending Deposits Removed */}
                    <Card className="bg-gray-900 border-gray-800 col-span-1 border-l-4 border-l-gray-500 opacity-50">
                        <CardHeader>
                            <CardTitle className="text-gray-400">Pending Deposits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-gray-500 py-8">Section Disabled</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
