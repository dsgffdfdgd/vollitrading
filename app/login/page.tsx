"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Eye, EyeOff, Lock, User, KeyRound, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [show2FA, setShow2FA] = useState(false)
    const [twoFACode, setTwoFACode] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: identifier,
                    password: password
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Login successful! Redirecting...")
                setTimeout(() => {
                    // Force a hard refresh to update UI based on new cookie
                    window.location.href = data.redirect || "/dashboard"
                }, 1000)
            } else {
                toast.error(data.error || "Invalid credentials")
            }
        } catch (error) {
            toast.error("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const verify2FA = () => {
        if (twoFACode === "123456") {
            setShow2FA(false)
            toast.success("2FA Verified. Redirecting...")
            setTimeout(() => router.push("/dashboard"), 1000)
        } else {
            toast.error("Invalid 2FA Code")
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Form Side */}
            <div className="flex items-center justify-center p-6 bg-background order-2 lg:order-1">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-1 px-0">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">VOLLIFX</span>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>Enter your email to sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email or Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="m@example.com"
                                        className="pl-10 h-11"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pl-10 h-11"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                >
                                    Remember for 30 days
                                </label>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Verifying...
                                    </div>
                                ) : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col px-0 gap-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" type="button" onClick={() => toast.info("Google Login is coming soon")}>
                            Google
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>

            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-900 relative overflow-hidden p-12 order-1 lg:order-2 border-l border-white/5">
                {/* Abstract chart simulation */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/50"></div>
                    <div className="absolute top-[30%] left-0 w-full h-[1px] bg-blue-500/20"></div>
                    <div className="absolute top-[70%] left-0 w-full h-[1px] bg-blue-500/20"></div>
                </div>

                <div className="relative z-10 text-center space-y-4 max-w-md">
                    <div className="h-16 w-16 bg-blue-500/10 rounded-2xl mx-auto flex items-center justify-center border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <ShieldAlert className="h-8 w-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Secure Access</h2>
                    <p className="text-gray-400">
                        VOLLIFX employs multi-layered encryption to protect your capital and personal data. Always ensure you are on the correct URL.
                    </p>
                </div>
            </div>

            <Dialog open={show2FA} onOpenChange={setShow2FA}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Two-Factor Authentication</DialogTitle>
                        <DialogDescription>Enter the 6-digit code sent to your device.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex justify-center">
                        <Input
                            className="text-center text-2xl tracking-[0.5em] font-mono h-14 w-48"
                            maxLength={6}
                            value={twoFACode}
                            onChange={(e) => setTwoFACode(e.target.value)}
                            placeholder="000000"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={verify2FA} className="w-full">Verify Identity</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
