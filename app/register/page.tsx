"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { useState } from "react"
import { Eye, EyeOff, ShieldCheck, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    })

    // Password Strength Logic
    const getPasswordStrength = (pass: string) => {
        let score = 0
        if (pass.length > 7) score += 1
        if (/[A-Z]/.test(pass)) score += 1
        if (/[0-9]/.test(pass)) score += 1
        if (/[^A-Za-z0-9]/.test(pass)) score += 1
        return score
    }

    const strength = getPasswordStrength(formData.password)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // ... (strength logic)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.agreeTerms) {
            toast.error("You must agree to the Terms & Conditions")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (strength < 3) {
            toast.error("Password is too weak. using a stronger password.")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: `${formData.firstName} ${formData.lastName}`
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Account created! Redirecting to login...")
                setTimeout(() => router.push("/login"), 1500)
            } else {
                toast.error(data.error || "Registration failed")
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-between bg-black relative overflow-hidden p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.15),transparent_40%)]"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white">VOLLI<span className="text-emerald-500">FX</span></h1>
                </div>
                <div className="relative z-10 space-y-6 max-w-lg">
                    <h2 className="text-4xl font-bold text-white leading-tight">Join the Elite Trading Ecosystem</h2>
                    <p className="text-gray-400 text-lg">Access institutional-grade liquidity, advanced risk management tools, and a community of professional traders.</p>

                    <div className="flex gap-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Bank-Grade Security
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Check className="w-4 h-4 text-emerald-500" /> ASIC Regulated
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-xs text-gray-500">
                    © 2025 VOLLIFX. All rights reserved.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-6 bg-background">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-1 px-0">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Enter your details below to create your account</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input
                                        id="firstName"
                                        required
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input
                                        id="lastName"
                                        required
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {/* Strength Meter */}
                                <div className="flex gap-1 h-1 mt-2">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full transition-colors duration-300 ${strength >= level
                                                ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-yellow-500' : 'bg-emerald-500')
                                                : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    {strength === 0 ? 'Enter password' : strength < 3 ? 'Weak' : 'Strong'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeTerms}
                                    onCheckedChange={(c) => setFormData({ ...formData, agreeTerms: c as boolean })}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                >
                                    I agree to the <Link href="/legal" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/legal" className="text-primary hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11" disabled={isSubmitting}>
                                {isSubmitting ? "Creating Account..." : "Create Account"}
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
                        <Button variant="outline" className="w-full" type="button">
                            Google
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
