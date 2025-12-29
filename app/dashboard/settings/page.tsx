"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"
import { useState, useEffect } from "react"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    // Security State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/user/dashboard')
                if (res.ok) {
                    const data = await res.json()
                    if (data.user) {
                        setEmail(data.user.email || "")
                        if (data.user.name) {
                            const parts = data.user.name.split(' ')
                            setFirstName(parts[0] || "")
                            setLastName(parts.slice(1).join(' ') || "")
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data")
            }
        }
        fetchUserData()
    }, [])

    const handleSaveProfile = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/user/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'profile',
                    firstName,
                    lastName
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Profile information updated successfully")
            } else {
                toast.error(data.error || "Failed to update profile")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateSecurity = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            return
        }
        if (!currentPassword) {
            toast.error("Current password is required")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/user/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'security',
                    currentPassword,
                    newPassword
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Security settings updated")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                toast.error(data.error || "Failed to update security settings")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" value={email} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <Button onClick={handleSaveProfile} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage your password and 2FA.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input
                                id="current"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-secondary/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Secure your account with 2FA.</p>
                            </div>
                            <Switch onCheckedChange={(checked) => toast.info(`2FA is now ${checked ? 'Enabled' : 'Disabled'}`)} />
                        </div>
                        <Button variant="secondary" onClick={handleUpdateSecurity} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Security"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your trading experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive daily performance summaries.</p>
                            </div>
                            <Switch defaultChecked onCheckedChange={(checked) => toast.success(`Email preference saved`)} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto-Compounding</Label>
                                <p className="text-sm text-muted-foreground">Automatically reinvest profits into trading pool.</p>
                            </div>
                            <Switch onCheckedChange={(checked) => toast.success(`Auto-compounding ${checked ? 'activated' : 'deactivated'}`)} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
