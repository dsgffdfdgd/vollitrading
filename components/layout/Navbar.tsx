"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronRight, BarChart2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Live Markets", href: "/#markets" },
    { name: "About", href: "/about" },
]

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-black/50 backdrop-blur-xl border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" : "bg-transparent py-6"
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <BarChart2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">VOLLI<span className="text-emerald-500">FX</span></span>
                    </Link>
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                import {ModeToggle} from "@/components/mode-toggle"

                // ... existing code ...

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
                    <ModeToggle />
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] rounded-full px-6 transition-all hover:scale-105">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 lg:hidden bg-black/95 backdrop-blur-xl border-l border-white/10"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                                    <BarChart2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">VOLLIFX</span>
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root px-6">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5 hover:text-emerald-400"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6 space-y-3">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center border-white/10 hover:bg-white/5 text-white">Log in</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
