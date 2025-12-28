"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Wallet, History, Settings, LogOut, PieChart, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ... imports ...
import { useState, useEffect } from "react"

const navigation = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "My Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Live Trading", href: "/dashboard/trading", icon: BarChart3 },
    { name: "Performance", href: "/dashboard/performance", icon: PieChart },
    { name: "Transactions", href: "/dashboard/transactions", icon: History },
    // Admin Panel is conditionally added
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar({ className, onClose }: { className?: string, onClose?: () => void }) {
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data?.user?.email === "allankipkoech65@gmail.com") {
                    setIsAdmin(true)
                }
            })
            .catch(err => console.error(err))
    }, [])

    const displayedNavigation = [...navigation];
    // Insert Admin Panel if admin
    if (isAdmin) {
        // Insert before Settings (last item)
        displayedNavigation.splice(displayedNavigation.length - 1, 0, { name: "Admin Panel", href: "/admin", icon: ShieldCheck });
    }

    return (
        <div className={cn("flex flex-col h-full w-64 bg-card border-r border-border", className)}>
            <div className="p-6 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">VOLLIFX</h1>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1">
                {displayedNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/login';
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
