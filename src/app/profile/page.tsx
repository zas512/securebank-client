"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateUser } from "@/redux/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentPin: "",
    newPin: "",
    confirmPin: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setPersonalInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: "",
      })
    }
  }, [isAuthenticated, user, router])

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For PIN fields, only allow numbers and limit to 4 digits
    if ((name === "currentPin" || name === "newPin" || name === "confirmPin") && value !== "") {
      if (!/^\d+$/.test(value) || value.length > 4) {
        return
      }
    }

    setSecurityInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // In a real app, this would be an API call to update user info
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(personalInfo)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in Redux store
      dispatch(updateUser({ fullName: personalInfo.fullName }))

      setMessage({ type: "success", text: "Personal information updated successfully" })
    } catch (error) {
      console.error("Update profile error:", error)
      setMessage({ type: "error", text: "Failed to update personal information" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    // Validate passwords
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would be an API call to update password
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: securityInfo.currentPassword,
      //     newPassword: securityInfo.newPassword
      //   })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: "Password updated successfully" })
      setSecurityInfo((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Update password error:", error)
      setMessage({ type: "error", text: "Failed to update password" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    // Validate PINs
    if (securityInfo.newPin !== securityInfo.confirmPin) {
      setMessage({ type: "error", text: "New PINs do not match" })
      setIsLoading(false)
      return
    }

    if (securityInfo.newPin.length !== 4) {
      setMessage({ type: "error", text: "PIN must be 4 digits" })
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would be an API call to update PIN
      // const response = await fetch('/api/user/pin', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     currentPin: securityInfo.currentPin,
      //     newPin: securityInfo.newPin
      //   })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: "PIN updated successfully" })
      setSecurityInfo((prev) => ({
        ...prev,
        currentPin: "",
        newPin: "",
        confirmPin: "",
      }))
    } catch (error) {
      console.error("Update PIN error:", error)
      setMessage({ type: "error", text: "Failed to update PIN" })
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
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePersonalInfoSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          required
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                        />
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
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={securityInfo.currentPassword}
                            onChange={handleSecurityInfoChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={securityInfo.newPassword}
                            onChange={handleSecurityInfoChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={securityInfo.confirmPassword}
                          onChange={handleSecurityInfoChange}
                          required
                        />
                      </div>
                      {message.type && (
                        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                          {message.text}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Security PIN</CardTitle>
                    <CardDescription>Update your 4-digit security PIN</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePinSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPin">Current PIN</Label>
                        <div className="relative">
                          <Input
                            id="currentPin"
                            name="currentPin"
                            type={showCurrentPin ? "text" : "password"}
                            maxLength={4}
                            value={securityInfo.currentPin}
                            onChange={handleSecurityInfoChange}
                            required
                            className="text-center text-lg tracking-widest"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPin(!showCurrentPin)}
                          >
                            {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle PIN visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPin">New PIN</Label>
                        <div className="relative">
                          <Input
                            id="newPin"
                            name="newPin"
                            type={showNewPin ? "text" : "password"}
                            maxLength={4}
                            value={securityInfo.newPin}
                            onChange={handleSecurityInfoChange}
                            required
                            className="text-center text-lg tracking-widest"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPin(!showNewPin)}
                          >
                            {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle PIN visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPin">Confirm New PIN</Label>
                        <Input
                          id="confirmPin"
                          name="confirmPin"
                          type="password"
                          maxLength={4}
                          value={securityInfo.confirmPin}
                          onChange={handleSecurityInfoChange}
                          required
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                      {message.type && (
                        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                          {message.text}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update PIN"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
