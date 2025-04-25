"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const accounts = [
  {
    id: "acc_1",
    type: "Checking",
    number: "****4567",
    balance: 2543.87,
  },
  {
    id: "acc_2",
    type: "Savings",
    number: "****7890",
    balance: 15750.42,
  },
]

export default function TransferPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
    pin: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Transfer details, Step 2: PIN verification

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For PIN field, only allow numbers and limit to 4 digits
    if (name === "pin" && value !== "") {
      if (!/^\d+$/.test(value) || value.length > 4) {
        return
      }
    }

    // For amount field, only allow numbers and decimal point
    if (name === "amount" && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fromAccount) {
      newErrors.fromAccount = "Please select a source account"
    }

    if (!formData.toAccount) {
      newErrors.toAccount = "Please select a destination account"
    }

    if (formData.fromAccount === formData.toAccount) {
      newErrors.toAccount = "Source and destination accounts cannot be the same"
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than zero"
    }

    // Check if amount is greater than source account balance
    if (formData.fromAccount && formData.amount) {
      const sourceAccount = accounts.find((acc) => acc.id === formData.fromAccount)
      if (sourceAccount && Number.parseFloat(formData.amount) > sourceAccount.balance) {
        newErrors.amount = "Insufficient funds"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.pin) {
      newErrors.pin = "PIN is required"
    } else if (formData.pin.length !== 4) {
      newErrors.pin = "PIN must be 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep1()) {
      return
    }

    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to process the transfer
      // const response = await fetch('/api/transactions/transfer', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fromAccountId: formData.fromAccount,
      //     toAccountId: formData.toAccount,
      //     amount: parseFloat(formData.amount),
      //     description: formData.description || 'Transfer',
      //     pin: formData.pin
      //   })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to success page or dashboard
      router.push("/dashboard?transfer=success")
    } catch (error) {
      console.error("Transfer error:", error)
      setErrors({ form: "Failed to process transfer. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6" />
            <span>SecureBank</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Money</CardTitle>
              <CardDescription>
                {step === 1 ? "Transfer funds between your accounts" : "Verify your transfer with your PIN"}
              </CardDescription>
            </CardHeader>
            {step === 1 ? (
              <form onSubmit={handleStep1Submit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">From Account</Label>
                    <Select
                      value={formData.fromAccount}
                      onValueChange={(value) => handleSelectChange("fromAccount", value)}
                    >
                      <SelectTrigger id="fromAccount">
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type} ({account.number}) - ${account.balance.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fromAccount && <p className="text-sm text-red-500">{errors.fromAccount}</p>}
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toAccount">To Account</Label>
                    <Select
                      value={formData.toAccount}
                      onValueChange={(value) => handleSelectChange("toAccount", value)}
                    >
                      <SelectTrigger id="toAccount">
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type} ({account.number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.toAccount && <p className="text-sm text-red-500">{errors.toAccount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Transfer reason"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit}>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">From</span>
                        <span className="text-sm font-medium">
                          {accounts.find((acc) => acc.id === formData.fromAccount)?.type} (
                          {accounts.find((acc) => acc.id === formData.fromAccount)?.number})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">To</span>
                        <span className="text-sm font-medium">
                          {accounts.find((acc) => acc.id === formData.toAccount)?.type} (
                          {accounts.find((acc) => acc.id === formData.toAccount)?.number})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount</span>
                        <span className="text-sm font-medium">${Number.parseFloat(formData.amount).toFixed(2)}</span>
                      </div>
                      {formData.description && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Description</span>
                          <span className="text-sm font-medium">{formData.description}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pin">Enter your 4-digit PIN</Label>
                    <Input
                      id="pin"
                      name="pin"
                      type="password"
                      maxLength={4}
                      value={formData.pin}
                      onChange={handleChange}
                      className="text-center text-lg tracking-widest"
                    />
                    {errors.pin && <p className="text-sm text-red-500">{errors.pin}</p>}
                  </div>

                  {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Confirm Transfer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
