"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, ShieldCheck, Globe, Target, Award } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16 sm:pb-24">
                    <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-blue-500/10 blur-[150px] rounded-full"></div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                            >
                                Redefining Institutional <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Trading Excellence</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-6 text-lg leading-8 text-gray-300"
                            >
                                VOLLIFX was built on a simple premise: Retail traders deserve the same infrastructure, risk controls, and liquidity access as top-tier hedge funds. We are bridging the gap.
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision Grid */}
                <section className="py-12 sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="bg-white/5 border-white/10 overflow-hidden group">
                                <CardContent className="p-8">
                                    <div className="mb-4 p-3 bg-blue-500/10 w-fit rounded-lg ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                        <Target className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Our Mission</h3>
                                    <p className="text-gray-400">To empower disciplined traders with the capital and technology needed to generate consistent, scalable returns in the global financial markets.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10 overflow-hidden group">
                                <CardContent className="p-8">
                                    <div className="mb-4 p-3 bg-emerald-500/10 w-fit rounded-lg ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Evidence Based</h3>
                                    <p className="text-gray-400">We don't believe in luck. We believe in data, backtesting, and strictly defined edge. Our platform rewards consistency over reckless gambling.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10 overflow-hidden group">
                                <CardContent className="p-8">
                                    <div className="mb-4 p-3 bg-purple-500/10 w-fit rounded-lg ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                        <ShieldCheck className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Safety First</h3>
                                    <p className="text-gray-400">Capital preservation is our #1 mandate. Our automated risk engine ensures that no single bad trade can jeopardize the pool's integrity.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <div className="bg-white/5 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-16 text-center lg:grid-cols-4">
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-400">Trades Executed</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">2.1M+</dd>
                            </div>
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-400">Capital Allocated</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">$45M</dd>
                            </div>
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-400">Global Traders</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">12k+</dd>
                            </div>
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-400">Countries Served</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">85</dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team/Philosophy Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:max-w-4xl">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center mb-12">Built by Traders, For Traders</h2>
                            <div className="space-y-8 text-gray-300 text-lg leading-8">
                                <p>
                                    VOLLIFX wasn't born in a boardroom; it was born on the trading floor. Our founders, frustrated by the lack of transparency in the "prop firm" space, set out to build a firm that actually aligns its incentives with its traders.
                                </p>
                                <p>
                                    Most firms want you to fail so they can keep your evaluation fees. We are different. We run a <strong>real capital allocation model</strong>. When you profit, our pool grows. When you follow risk rules, our longevity increases. We are partners in this journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
