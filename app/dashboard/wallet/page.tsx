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

import { Suspense } from "react"

function WalletContent() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "deposit")

    // ... rest of the component implementation ...
    // Note: I will need to copy the entire logic of `WalletPage` into `WalletContent`
    // and then export `WalletPage` as a wrapper with Suspense.
    // However, the tool is strictly replacement. I will implement the wrapper pattern in-place.

    const [mainBalance, setMainBalance] = useState(0)
    const [profitBalance, setProfitBalance] = useState(0.00)
    const [tradingBalance, setTradingBalance] = useState(0.00) // New State
    const [depositAmount, setDepositAmount] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("crypto")
    const [isLoading, setIsLoading] = useState(false)
    const [withdrawMethod, setWithdrawMethod] = useState("USDT")
    const [withdrawAddress, setWithdrawAddress] = useState("")
    const [withdrawAmountInput, setWithdrawAmountInput] = useState("")
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

    // FETCH WALLET DATA ON MOUNT
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const res = await fetch('/api/user/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    if (data.wallet) {
                        setMainBalance(data.wallet.mainBalance || 0);
                        setProfitBalance(data.wallet.profitBalance || 0);
                        setTradingBalance(data.wallet.tradingBalance || 0);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch wallet data", error);
            }
        };
        fetchWalletData();
    }, []);

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



            if (!userDetails.firstName || !userDetails.lastName || !userDetails.phone || !userDetails.telegram) {
                toast.error("Please fill in all personal details for identification")
                return
            }

            setIsLoading(true)
            try {
                const response = await fetch('/api/pesapal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: depositAmount,
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        email: "user@example.com",
                        phoneNumber: userDetails.phone,
                    })
                })

                const data = await response.json()

                if (data.redirect_url) {
                    toast.success("Redirecting to PesaPal Payment Gateway...")
                    window.location.href = data.redirect_url
                } else {
                    console.error("Payment Gateway Error:", data.error)
                    // Display specific error from backend if available
                    toast.error(data.error || "Online payment initialization failed.")
                }
            } catch (error) {
                console.error("Payment Network Error:", error)
                toast.error("Network error. Please try again.")
            } finally {
                setIsLoading(false)
            }
            return
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

    const handleTransferToTrading = async () => {
        if (mainBalance <= 0) {
            toast.error("Insufficient funds in Main Wallet. Please deposit first.")
            return;
        }

        try {
            const res = await fetch('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: mainBalance }) // Transfer ALL for now, or add input later
            });

            if (res.ok) {
                toast.success(`Successfully transferred $${mainBalance.toFixed(2)} to Profit Wallet`);
                // Optimistic Update
                setProfitBalance(prev => prev + mainBalance);
                setMainBalance(0);
            } else {
                const data = await res.json();
                toast.error(data.error || "Transfer failed");
            }
        } catch (e) {
            toast.error("Network error");
        }
    }

    const handleWithdrawProfit = async () => {
        const amount = parseFloat(withdrawAmountInput)

        if (isNaN(amount) || amount < 50) {
            toast.error("Minimum withdrawal amount is $50")
            return
        }

        if (amount > profitBalance) {
            toast.error("Insufficient profit balance")
            return
        }

        if (!withdrawAddress) {
            toast.error("Please provide withdrawal details (Address/Account/Email)")
            return
        }

        try {
            const res = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    method: withdrawMethod,
                    address: withdrawAddress
                })
            });

            if (res.ok) {
                toast.success("Withdrawal request submitted for approval.");
                setProfitBalance(prev => prev - amount); // Optimistic Update
                setWithdrawAmountInput("");
            } else {
                const data = await res.json();
                toast.error(data.error || "Withdrawal failed");
            }
        } catch (e) {
            toast.error("Network error");
        }
    }

    const handleCompound = async () => {
        if (profitBalance <= 0) {
            toast.error("No profits to transfer")
            return;
        }

        try {
            const res = await fetch('/api/wallet/compound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: profitBalance })
            });

            if (res.ok) {
                toast.success(`Transferred $${profitBalance.toFixed(2)} to Main Wallet`)
                setMainBalance(prev => prev + profitBalance);
                setProfitBalance(0);
            } else {
                const data = await res.json();
                toast.error(data.error || "Transfer failed");
            }
        } catch (e) {
            toast.error("Network error");
        }
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
                                        <DialogTitle>Transfer to Profit Wallet</DialogTitle>
                                        <DialogDescription>Move funds from your Main Wallet to your Profit Wallet.</DialogDescription>
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
                                        <DialogDescription>Withdraw your trading profits to your external wallet. Minimum withdrawal is $50.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="text-sm text-gray-400 mb-2">Available Profits</div>
                                        <div className="text-2xl font-bold text-emerald-400">${profitBalance.toFixed(2)}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm">Withdrawal Method</label>
                                            <select
                                                className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                                                value={withdrawMethod}
                                                onChange={(e) => setWithdrawMethod(e.target.value)}
                                            >
                                                <option value="USDT">USDT (TRC20)</option>
                                                <option value="BTC">Bitcoin (BTC)</option>
                                                <option value="ETH">Ethereum (ETH)</option>
                                                <option value="BANK">Bank Transfer</option>
                                                <option value="PAYPAL">PayPal</option>
                                                <option value="PAYONEER">Payoneer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm">
                                                {withdrawMethod === 'BANK' ? 'Account Number/IBAN' :
                                                    withdrawMethod.includes('PAY') ? 'Email Address' : 'Wallet Address'}
                                            </label>
                                            <Input
                                                placeholder={
                                                    withdrawMethod === 'BANK' ? "Enter IBAN/Account" :
                                                        withdrawMethod.includes('PAY') ? "Enter Email" : "Enter Wallet Address"
                                                }
                                                value={withdrawAddress}
                                                onChange={(e) => setWithdrawAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm">Amount</label>
                                            <Input
                                                type="number"
                                                placeholder="Min $50"
                                                value={withdrawAmountInput}
                                                onChange={(e) => setWithdrawAmountInput(e.target.value)}
                                            />
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
                                        <DialogTitle>Transfer Profits to Main</DialogTitle>
                                        <DialogDescription>Move your profits to your Main Wallet.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
                                            <Activity className="h-4 w-4" />
                                            <span className="text-sm">Secure your profits by moving them to your Main Wallet.</span>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCompound} className="w-full bg-emerald-600 hover:bg-emerald-700">Confirm Transfer</Button>
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
                                        { id: 'crypto', label: 'Crypto (USDT/BTC)' },
                                        { id: 'card', label: 'Credit/Debit Card' }
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
                                {selectedPaymentMethod === 'card' && (
                                    <div className="p-6 border border-white/5 rounded-xl bg-secondary/10 space-y-4">
                                        <div className="text-sm font-semibold flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-emerald-400" />
                                            Identification Details
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Please provide your real name and phone number as they appear on your payment method.
                                            Include your Telegram username for admin verification.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</label>
                                                <Input
                                                    placeholder="Real First Name"
                                                    value={userDetails.firstName}
                                                    onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</label>
                                                <Input
                                                    placeholder="Real Last Name"
                                                    value={userDetails.lastName}
                                                    onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</label>
                                                <Input
                                                    placeholder="+254..."
                                                    value={userDetails.phone}
                                                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wider text-muted-foreground">Telegram Username</label>
                                                <Input
                                                    placeholder="@username"
                                                    value={userDetails.telegram}
                                                    onChange={(e) => setUserDetails({ ...userDetails, telegram: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedPaymentMethod === 'card' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 p-6 border border-white/10 rounded-xl bg-black/20">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="text-sm font-semibold">Payment Details</div>
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                <Lock className="h-3 w-3" />
                                                Secure 256-bit SSL Encryption
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                                            {/* Visual Card */}
                                            <div className="relative aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 text-white shadow-2xl border border-white/10 overflow-hidden group">
                                                {/* Card Background Effects */}
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.3),rgba(255,255,255,0))]" />
                                                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

                                                <div className="relative h-full flex flex-col justify-between z-10">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-12 h-8 rounded bg-yellow-400/20 border border-yellow-400/40 relative overflow-hidden backdrop-blur-sm">
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-[120%] h-[1px] bg-yellow-400/30 rotate-45 transform" />
                                                                <div className="w-[120%] h-[1px] bg-yellow-400/30 -rotate-45 transform" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xl font-bold italic tracking-wider opacity-80">VISA</div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="font-mono text-2xl tracking-[0.15em] drop-shadow-md">
                                                            {cardDetails.number || "0000 0000 0000 0000"}
                                                        </div>

                                                        <div className="flex justify-between items-end">
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] uppercase tracking-wider text-gray-400">Card Holder</div>
                                                                <div className="font-medium tracking-wide uppercase truncate max-w-[150px]">
                                                                    {cardDetails.name || "YOUR NAME"}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1 text-right">
                                                                <div className="text-[10px] uppercase tracking-wider text-gray-400">Expires</div>
                                                                <div className="font-mono">{cardDetails.expiry || "MM/YY"}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Inputs */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs uppercase tracking-wider text-muted-foreground">Name on Card</label>
                                                    <Input
                                                        autoComplete="off"
                                                        data-lpignore="true"
                                                        placeholder="As written on card"
                                                        className="bg-background/50 border-white/10 h-10"
                                                        value={cardDetails.name}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs uppercase tracking-wider text-muted-foreground">Card Number</label>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            autoComplete="off"
                                                            data-lpignore="true"
                                                            placeholder="0000 0000 0000 0000"
                                                            className="pl-10 bg-background/50 border-white/10 h-10 font-mono"
                                                            value={cardDetails.number}
                                                            onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                                                            maxLength={19}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Expiry Date</label>
                                                        <Input
                                                            autoComplete="off"
                                                            data-lpignore="true"
                                                            placeholder="MM/YY"
                                                            className="bg-background/50 border-white/10 h-10 text-center"
                                                            value={cardDetails.expiry}
                                                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                                                            maxLength={5}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs uppercase tracking-wider text-muted-foreground">CVC / CWW</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                                            <Input
                                                                autoComplete="off"
                                                                data-lpignore="true"
                                                                type="password"
                                                                placeholder="•••"
                                                                className="pl-9 bg-background/50 border-white/10 h-10 text-center tracking-widest"
                                                                value={cardDetails.cvc}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                                maxLength={4}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


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
            </div >
        </div >
    )
}

export default function WalletPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading wallet...</div>}>
            <WalletContent />
        </Suspense>
    )
}
