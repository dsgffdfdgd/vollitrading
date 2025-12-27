"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, ShieldCheck, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const chartData = [
    { time: '09:00', value: 1240 },
    { time: '10:00', value: 1255 },
    { time: '11:00', value: 1245 },
    { time: '12:00', value: 1275 },
    { time: '13:00', value: 1300 },
    { time: '14:00', value: 1285 },
    { time: '15:00', value: 1340 },
    { time: '16:00', value: 1360 },
]

export function Hero() {
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
                        Master the Markets with <span className="text-primary">VOLLIFX</span>
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
                            <div className="text-3xl font-bold text-foreground">$25M+</div>
                            <div className="text-sm text-muted-foreground">Volume Traded</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-foreground">12k+</div>
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
                                {/* Mock UI Header */}
                                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                                    </div>
                                    <div className="h-2 w-20 rounded-full bg-muted"></div>
                                </div>
                                {/* Mock Chart Area */}
                                {/* Real Chart Area */}
                                <div className="h-64 w-full rounded-lg bg-black/40 border border-white/5 mb-4 relative overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                            <XAxis dataKey="time" hide />
                                            <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                                itemStyle={{ color: '#10b981' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#10b981"
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
