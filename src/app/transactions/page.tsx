"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { DollarSign, ArrowRightLeft, Filter, Search, Download, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { fetchTransactions } from "@/redux/actions/transactionActions"
import { fetchAccounts } from "@/redux/actions/accountActions"
import type { AppDispatch, RootState } from "@/redux/store"

export default function TransactionsPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { accounts } = useSelector((state: RootState) => state.accounts)
  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions)

  const [filters, setFilters] = useState({
    accountId: "all",
    type: "all",
    category: "all",
    search: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Fetch accounts and transactions
    dispatch(fetchAccounts())
    dispatch(fetchTransactions(null))
  }, [isAuthenticated, router, dispatch])

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))

    // If account filter changes, fetch transactions for that account
    if (name === "accountId" && value !== "all") {
      dispatch(fetchTransactions(value))
    } else if (name === "accountId" && value === "all") {
      dispatch(fetchTransactions(null))
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by account
    if (filters.accountId !== "all" && transaction.accountId !== filters.accountId) {
      return false
    }

    // Filter by type
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false
    }

    // Filter by category
    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false
    }

    // Filter by search term
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Filter by date range
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false
    }

    return true
  })

  // Calculate statistics
  const totalIncome = filteredTransactions.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const netChange = totalIncome - totalExpenses

  // Get unique categories for filter
  const categories = Array.from(new Set(transactions.map((tx) => tx.category)))

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold">Transactions</h1>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  New Transfer
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">For selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">For selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Change</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {netChange >= 0 ? "+" : ""}
                    {netChange.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Income minus expenses</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View and filter your transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search transactions..."
                        className="pl-8 w-[200px]"
                        value={filters.search}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <Select value={filters.accountId} onValueChange={(value) => handleFilterChange("accountId", value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type} ({account.number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Filter Transactions</h4>
                          <div className="space-y-2">
                            <Label htmlFor="type">Transaction Type</Label>
                            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                              <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="credit">Credits</SelectItem>
                                <SelectItem value="debit">Debits</SelectItem>
                                <SelectItem value="transfer">Transfers</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={filters.category}
                              onValueChange={(value) => handleFilterChange("category", value)}
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateRange">Date Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="startDate" className="sr-only">
                                  Start Date
                                </Label>
                                <Input
                                  id="startDate"
                                  type="date"
                                  value={filters.startDate}
                                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                                  placeholder="Start date"
                                />
                              </div>
                              <div>
                                <Label htmlFor="endDate" className="sr-only">
                                  End Date
                                </Label>
                                <Input
                                  id="endDate"
                                  type="date"
                                  value={filters.endDate}
                                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                                  placeholder="End date"
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFilters({
                                accountId: "all",
                                type: "all",
                                category: "all",
                                search: "",
                                startDate: "",
                                endDate: "",
                              })
                            }
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="all" className="w-full">
                  <div className="border-b px-4">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="transfers">Transfers</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="all" className="space-y-4">
                    {isLoading ? (
                      <div className="p-4 text-center">Loading transactions...</div>
                    ) : filteredTransactions.length > 0 ? (
                      <div className="divide-y">
                        {filteredTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`rounded-full p-2 ${
                                  transaction.type === "credit"
                                    ? "bg-green-100"
                                    : transaction.type === "debit"
                                      ? "bg-red-100"
                                      : "bg-blue-100"
                                }`}
                              >
                                {transaction.type === "credit" ? (
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                ) : transaction.type === "debit" ? (
                                  <DollarSign className="h-4 w-4 text-red-600" />
                                ) : (
                                  <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex gap-2">
                                  <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {accounts.find((acc) => acc.id === transaction.accountId)?.type ||
                                      "Unknown Account"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p
                                className={`font-medium ${
                                  transaction.type === "credit"
                                    ? "text-green-600"
                                    : transaction.type === "debit"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                }`}
                              >
                                {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                              </p>
                              <Badge variant="outline">{transaction.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No transactions found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          No transactions match your current filters.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            setFilters({
                              accountId: "all",
                              type: "all",
                              category: "all",
                              search: "",
                              startDate: "",
                              endDate: "",
                            })
                          }
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="income" className="space-y-4">
                    <div className="divide-y">
                      {filteredTransactions
                        .filter((tx) => tx.amount > 0)
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full p-2 bg-green-100">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex gap-2">
                                  <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {accounts.find((acc) => acc.id === transaction.accountId)?.type ||
                                      "Unknown Account"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-green-600">+${transaction.amount.toFixed(2)}</p>
                              <Badge variant="outline">{transaction.category}</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="expenses" className="space-y-4">
                    <div className="divide-y">
                      {filteredTransactions
                        .filter((tx) => tx.amount < 0 && tx.type === "debit")
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full p-2 bg-red-100">
                                <DollarSign className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex gap-2">
                                  <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {accounts.find((acc) => acc.id === transaction.accountId)?.type ||
                                      "Unknown Account"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-red-600">${transaction.amount.toFixed(2)}</p>
                              <Badge variant="outline">{transaction.category}</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="transfers" className="space-y-4">
                    <div className="divide-y">
                      {filteredTransactions
                        .filter((tx) => tx.type === "transfer")
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full p-2 bg-blue-100">
                                <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex gap-2">
                                  <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {accounts.find((acc) => acc.id === transaction.accountId)?.type ||
                                      "Unknown Account"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-blue-600">${transaction.amount.toFixed(2)}</p>
                              <Badge variant="outline">{transaction.category}</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t p-4 flex justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
                <Button variant="outline" disabled={filteredTransactions.length >= transactions.length}>
                  Load More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
