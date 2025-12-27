"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"

export default function SettingsPage() {
    const handleSaveProfile = () => {
        toast.success("Profile information updated successfully")
    }

    const handleUpdateSecurity = () => {
        toast.success("Security settings updated")
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
                                <Input id="firstName" defaultValue="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" defaultValue="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" defaultValue="john.doe@example.com" disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
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
                            <Input id="current" type="password" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-secondary/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Secure your account with 2FA.</p>
                            </div>
                            <Switch onCheckedChange={(checked) => toast.info(`2FA is now ${checked ? 'Enabled' : 'Disabled'}`)} />
                        </div>
                        <Button variant="secondary" onClick={handleUpdateSecurity}>Update Security</Button>
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
