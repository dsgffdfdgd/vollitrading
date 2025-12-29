"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, ShieldCheck, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"

const chartData = [
    { time: '10:00', xau: 2024.50 },
    { time: '10:15', xau: 2028.10 },
    { time: '10:30', xau: 2026.40 },
    { time: '10:45', xau: 2031.20 },
    { time: '11:00', xau: 2029.80 },
    { time: '11:15', xau: 2035.50 },
    { time: '11:30', xau: 2033.20 },
    { time: '11:45', xau: 2038.90 },
    { time: '12:00', xau: 2036.50 },
]

export function Hero() {
    const [stats, setStats] = useState({ activeTraders: 12450, pooledCapital: 25000000 })

    useEffect(() => {
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
            .catch(err => console.error("Failed to fetch landing stats", err))
    }, [])

    return (
        <div className="relative overflow-hidden bg-background pt-14 border-b">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex"
                    >
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-emerald-600 dark:text-emerald-400 ring-1 ring-black/10 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 transition-all">
                            Institutional-Grade Trading Infrastructure <span aria-hidden="true">&rarr;</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
                    >
                        Turn Trades into Cash with <span className="text-primary">VOLLIFX</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-8 text-muted-foreground"
                    >
                        Allocating capital to high-performance trading pools. Experience transparency, advanced risk management, and real-time analytics in a professional ecosystem.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex items-center gap-x-6"
                    >
                        <Link href="/register">
                            <Button size="lg" className="rounded-md px-8">
                                Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#features" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                            Live Performance <span aria-hidden="true">→</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-14 grid grid-cols-3 gap-4 border-t border-border pt-8"
                    >
                        <div>
                            <div className="text-3xl font-bold text-foreground">${(stats.pooledCapital / 1000000).toFixed(1)}M+</div>
                            <div className="text-sm text-muted-foreground">Volume Traded</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-foreground">{(stats.activeTraders / 1000).toFixed(1)}k+</div>
                            <div className="text-sm text-muted-foreground">Active Traders</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-foreground"><span className="text-emerald-500">99.9%</span></div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
                >
                    <div className="relative mx-auto w-[22rem] max-w-full lg:mr-0 lg:w-[40rem]">
                        {/* Visual Representation of Platform - Simplified */}
                        <div className="rounded-xl bg-card border border-border resize-none shadow-sm p-2">
                            <div className="rounded-lg bg-background p-4 border border-border">
                                {/* Mock UI Header - Market Ticker */}
                                <div className="flex items-center justify-between mb-6 border-b border-border pb-4 overflow-x-auto">
                                    <div className="flex gap-6 text-xs font-mono">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground font-bold">XAUUSD</span>
                                            <span className="text-emerald-500 font-semibold">2,036.50 <span className="text-[10px] ml-1">▲ 0.45%</span></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground font-bold">USOIL</span>
                                            <span className="text-red-500 font-semibold">74.20 <span className="text-[10px] ml-1">▼ 1.20%</span></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground font-bold">NAS100</span>
                                            <span className="text-emerald-500 font-semibold">16,840.10 <span className="text-[10px] ml-1">▲ 1.10%</span></span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-2 w-20 rounded-full bg-muted/20"></div>
                                </div>
                                {/* Real Chart Area */}
                                <div className="h-64 w-full rounded-lg bg-black/40 border border-white/5 mb-4 relative overflow-hidden">
                                    <div className="absolute top-2 left-3 z-10 text-[10px] font-mono text-white/40">GOLD vs US DOLLAR (15m)</div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                            <XAxis dataKey="time" hide />
                                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                                itemStyle={{ color: '#fbbf24' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="xau"
                                                stroke="#fbbf24"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Mock Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-10 rounded bg-muted animate-pulse"></div>
                                    <div className="h-10 rounded bg-muted animate-pulse delay-75"></div>
                                    <div className="h-10 rounded bg-muted animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    )
}
