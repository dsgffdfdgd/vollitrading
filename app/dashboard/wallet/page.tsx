"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet, Activity, Copy, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { useSearchParams } from "next/navigation"

export default function WalletPage() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "deposit")
    const [mainBalance, setMainBalance] = useState(0)
    const [profitBalance, setProfitBalance] = useState(0.00)
    const [depositAmount, setDepositAmount] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("crypto")
    const [isLoading, setIsLoading] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: ""
    })

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        telegram: ""
    })

    const formatCardNumber = (val: string) => {
        return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)
    }

    const formatExpiry = (val: string) => {
        return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5)
    }

    const handleDeposit = () => {
        setActiveTab("deposit")
        document.getElementById("transaction-tabs")?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleWithdrawClick = () => {
        setActiveTab("withdraw")
        document.getElementById("transaction-tabs")?.scrollIntoView({ behavior: 'smooth' })
    }

    const processDeposit = async () => {
        if (!depositAmount || Number(depositAmount) < 100) {
            toast.error("Minimum deposit amount is $100")
            return
        }

        // Card payment removed


        if (selectedPaymentMethod === 'card') {
            // ... existing PesaPal logic ...
            setIsLoading(true)
            // ...
            // We won't change this part yet, as it redirects to external.
            // But for coherence we should probably log a PENDING transaction here too.
        }

        // Default or Crypto Deposit (Simulation of "I have sent funds")
        setIsLoading(true)
        try {
            const res = await fetch('/api/wallet/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: depositAmount,
                    type: "DEPOSIT",
                    method: selectedPaymentMethod
                })
            });

            if (res.ok) {
                const data = await res.json()
                toast.success("Deposit submitted for approval. Please wait for admin confirmation.")
                // No optimistic update - balance stays until approved
                setDepositAmount("")
            } else {
                toast.error("Failed to process deposit")
            }
        } catch (e) {
            toast.error("Connection error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTransferToTrading = () => {
        if (mainBalance <= 0) {
            toast.error("Insufficient funds in Main Wallet. Please deposit first.")
            return;
        }
        toast.success(`Transferred $${mainBalance.toFixed(2)} to Trading Wallet`)
        setMainBalance(0)
    }

    const handleWithdrawProfit = () => {
        if (profitBalance <= 0) {
            toast.error("No profits available to withdraw")
            return
        }
        toast.success("Withdrawal request submitted for approval.")
        setProfitBalance(0)
    }

    const handleCompound = () => {
        if (profitBalance <= 0) {
            toast.error("No profits to compound")
            return;
        }
        toast.success(`Compounded $${profitBalance.toFixed(2)} into Trading Pool`)
        setProfitBalance(0)
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Wallet Management</h2>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Wallet Card */}
                <Card className="bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border-indigo-500/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-indigo-400" /> Main Wallet
                        </CardTitle>
                        <CardDescription>Available for deposit/withdrawal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white mb-6">${mainBalance.toFixed(2)}</div>
                        <div className="flex gap-2">
                            <Button onClick={handleDeposit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                Deposit Area
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 border-indigo-500/30 hover:bg-indigo-950/50 hover:text-indigo-200">
                                        Transfer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Transfer to Trading Pool</DialogTitle>
                                        <DialogDescription>Move funds from your Main Wallet to the live Trading Pool.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="text-sm text-gray-400 mb-2">Available to Transfer</div>
                                        <div className="text-2xl font-bold text-white">${mainBalance.toFixed(2)}</div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleTransferToTrading} className="w-full bg-emerald-600 hover:bg-emerald-700">Confirm Transfer</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Profit Wallet Card */}
                <Card className="bg-gradient-to-br from-emerald-950/50 to-slate-900/50 border-emerald-500/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-400" /> Profit Wallet
                        </CardTitle>
                        <CardDescription>Generated trading profits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white mb-6">${profitBalance.toFixed(2)}</div>
                        <div className="mt-4 flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                        Withdraw
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Withdraw Profits</DialogTitle>
                                        <DialogDescription>Withdraw your trading profits to your external wallet.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="text-sm text-gray-400 mb-2">Available Profits</div>
                                        <div className="text-2xl font-bold text-emerald-400">${profitBalance.toFixed(2)}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm">Withdrawal Method</label>
                                            <select className="w-full p-2 rounded-md bg-white/5 border border-white/10">
                                                <option>USDT (TRC20)</option>
                                                <option>Bitcoin (BTC)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm">Wallet Address / Number</label>
                                            <Input placeholder="Enter destination details" />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-4">
                                        <Button onClick={handleWithdrawProfit} className="w-full" variant="destructive">Request Withdrawal</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>


                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 border-emerald-500/30 hover:bg-emerald-950/50 hover:text-emerald-200">
                                        Compound
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Reinvest Profits</DialogTitle>
                                        <DialogDescription>Compound your profits back into the Trading Pool for higher potential returns.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
                                            <Activity className="h-4 w-4" />
                                            <span className="text-sm">Compounding increases your capital base instantly.</span>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCompound} className="w-full bg-emerald-600 hover:bg-emerald-700">Confirm Reinvestment</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div id="transaction-tabs">
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions Area</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="deposit">Deposit Funds</TabsTrigger>
                                <TabsTrigger value="withdraw">Withdraw Capital</TabsTrigger>
                            </TabsList>
                            <TabsContent value="deposit" className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'crypto', label: 'Crypto (USDT/BTC)' }
                                    ].map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all group ${selectedPaymentMethod === method.id ? 'bg-primary/10 border-primary' : 'border-white/10 hover:bg-white/5 hover:border-primary/50'}`}
                                        >
                                            <div className={`font-semibold mb-2 transition-colors ${selectedPaymentMethod === method.id ? 'text-primary' : 'group-hover:text-primary'}`}>{method.label}</div>
                                            <p className="text-xs text-muted-foreground">Instant • low fees</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedPaymentMethod === 'crypto' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="p-4 rounded-lg bg-black/20 border border-white/10 space-y-4">
                                            <div>
                                                <label className="text-xs text-muted-foreground block mb-2">Bitcoin (BTC) Address</label>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-black/40 p-3 rounded font-mono text-sm truncate">bc1qmsxh3uhr5qs55rhruegshf8xxu5l4llrcequ9f</div>
                                                    <Button size="icon" variant="outline" onClick={() => {
                                                        navigator.clipboard.writeText("bc1qmsxh3uhr5qs55rhruegshf8xxu5l4llrcequ9f")
                                                        toast.success("BTC Address copied")
                                                    }}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground block mb-2">USDT (ERC20) Address</label>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-black/40 p-3 rounded font-mono text-sm truncate">0x5a90d595ac6bd7438eb8a2fefd302551ac4651b6</div>
                                                    <Button size="icon" variant="outline" onClick={() => {
                                                        navigator.clipboard.writeText("0x5a90d595ac6bd7438eb8a2fefd302551ac4651b6")
                                                        toast.success("USDT Address copied")
                                                    }}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* User Details Form for PesaPal/Legitimacy */}



                                <div className="p-6 border border-white/5 rounded-xl bg-secondary/10">
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="grid w-full items-center gap-2">
                                            <label htmlFor="amount" className="text-sm font-medium">Amount to Deposit (USD)</label>
                                            <Input
                                                type="number"
                                                id="amount"
                                                placeholder="Min $100"
                                                className="text-lg h-12"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                            />
                                        </div>
                                        <Button onClick={processDeposit} size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 h-12 px-8" disabled={isLoading}>
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                                                    Processing...
                                                </span>
                                            ) : (
                                                selectedPaymentMethod === 'crypto' ? 'I Have Sent Funds' : 'Proceed to Payment'
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        * Deposits are processed securely. Minimum deposit is $100.
                                    </p>
                                </div>
                            </TabsContent>
                            <TabsContent value="withdraw" className="pt-4">
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>To withdraw capital (Main Wallet), please ensure you have no locked active trades.</p>
                                    <p className="mt-2 text-sm">Profit withdrawals should be done via the Profit Wallet card above.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            {/* ... */}
        </div >
    )
}
