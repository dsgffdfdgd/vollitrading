"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Filter } from "lucide-react"

interface Transaction {
    id: string
    type: string
    amount: number
    createdAt: string
    status: string
    reference?: string
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filter, setFilter] = useState("All")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/transactions')
                const data = await res.json()
                if (data.transactions) {
                    setTransactions(data.transactions)
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    const normalizedFilter = filter.toUpperCase()

    const filteredTransactions = filter === "All"
        ? transactions
        : transactions.filter(t => t.type === normalizedFilter)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
                <div className="flex gap-2">
                    {['All', 'Deposit', 'Withdrawal', 'Profit', 'Loss'].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {filter} Transactions
                    </CardTitle>
                    <CardDescription>A comprehensive log of all your account activities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">Loading transactions...</TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No transactions found.</TableCell>
                                </TableRow>
                            ) : filteredTransactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-medium text-xs font-mono">{txn.id}</TableCell>
                                    <TableCell>{txn.type}</TableCell>
                                    <TableCell className="text-muted-foreground">{txn.reference || "-"}</TableCell>
                                    <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className={['DEPOSIT', 'PROFIT'].includes(txn.type) ? 'text-emerald-400' : 'text-red-400'}>
                                        {['WITHDRAWAL', 'LOSS'].includes(txn.type) ? '-' : '+'}${txn.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={txn.status === 'COMPLETED' ? 'secondary' : 'outline'} className={txn.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}>
                                            {txn.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
