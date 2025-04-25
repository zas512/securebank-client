"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Lock, Eye, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RootState } from "@/redux/store"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    transactionNotifications: true,
    sessionTimeout: "30",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSwitchChange = (name: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSecuritySettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // In a real app, this would be an API call to update security settings
      // const response = await fetch('/api/user/security-settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(securitySettings)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: "Security settings updated successfully" })
    } catch (error) {
      console.error("Update security settings error:", error)
      setMessage({ type: "error", text: "Failed to update security settings" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="security" className="space-y-4">
              <TabsList>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security preferences</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSecuritySettingsSubmit}>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          id="twoFactorAuth"
                          checked={securitySettings.twoFactorAuth}
                          onCheckedChange={() => handleSwitchChange("twoFactorAuth")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="loginNotifications">Login Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when someone logs into your account
                          </p>
                        </div>
                        <Switch
                          id="loginNotifications"
                          checked={securitySettings.loginNotifications}
                          onCheckedChange={() => handleSwitchChange("loginNotifications")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout</Label>
                        <Select
                          value={securitySettings.sessionTimeout}
                          onValueChange={(value) => handleSelectChange("sessionTimeout", value)}
                        >
                          <SelectTrigger id="sessionTimeout">
                            <SelectValue placeholder="Select timeout duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after a period of inactivity
                        </p>
                      </div>

                      {message.type && (
                        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                          {message.text}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Security Activity</CardTitle>
                    <CardDescription>Review recent security events on your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Account login</p>
                          <p className="text-sm text-gray-500">Today, 10:45 AM • IP: 192.168.1.1</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-green-100 p-2">
                          <Lock className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Password changed</p>
                          <p className="text-sm text-gray-500">Yesterday, 3:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orange-100 p-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Session timeout</p>
                          <p className="text-sm text-gray-500">Apr 20, 2025, 5:15 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">View All Activity</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transactionNotifications">Transaction Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for all transactions</p>
                      </div>
                      <Switch
                        id="transactionNotifications"
                        checked={securitySettings.transactionNotifications}
                        onCheckedChange={() => handleSwitchChange("transactionNotifications")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="balanceAlerts">Balance Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when your balance falls below a threshold
                        </p>
                      </div>
                      <Switch id="balanceAlerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions
                        </p>
                      </div>
                      <Switch id="marketingEmails" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                    <CardDescription>Customize your banking experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultAccount">Default Account</Label>
                      <Select defaultValue="checking">
                        <SelectTrigger id="defaultAccount">
                          <SelectValue placeholder="Select default account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking Account</SelectItem>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="darkMode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                      </div>
                      <Switch id="darkMode" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
