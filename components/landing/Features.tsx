"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, PieChart, TrendingUp, Users, Smartphone, Globe } from "lucide-react"

const features = [
    {
        name: 'Managed Trading Pools',
        description: 'Expertly managed liquidity pools designed to maximize returns while minimizing volatility exposure.',
        icon: PieChart,
        color: "blue"
    },
    {
        name: 'Performance-Based Returns',
        description: 'Our success is tied to yours. We operate on a strict performance fee model with no hidden management costs.',
        icon: TrendingUp,
        color: "emerald"
    },
    {
        name: 'Advanced Risk Management',
        description: 'Institutional-grade risk protocols including automated stop-losses and exposure limits to protect capital.',
        icon: Lock,
        color: "indigo"
    },
    {
        name: 'Global Access',
        description: 'Trade from anywhere in the world with our globally distributed low-latency infrastructure.',
        icon: Globe,
        color: "violet"
    },
    {
        name: 'Community Driven',
        description: 'Join thousands of traders in a transparent ecosystem where performance data is public and verifiable.',
        icon: Users,
        color: "amber"
    },
    {
        name: 'Mobile First Experience',
        description: 'Monitor your portfolio, withdraw profits, and manage settings seamlessly from any device.',
        icon: Smartphone,
        color: "cyan"
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[500px] bg-indigo-900/10 blur-[100px] -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Why Choose VOLLIFX?</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Everything you need for institutional success
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-400">
                        We bridge the gap between retail traders and institutional strategies, providing tools previously reserved for hedge funds.
                    </p>
                </div>
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative flex flex-col p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm group"
                            >
                                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-${feature.color}-500/20 to-transparent border border-${feature.color}-500/20 shadow-lg group-hover:shadow-${feature.color}-500/20`}>
                                    <feature.icon className={`h-7 w-7 text-${feature.color}-400`} aria-hidden="true" />
                                </div>
                                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
