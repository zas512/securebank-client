"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  User,
  CreditCard,
  ArrowRightLeft,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Plus,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const accounts = [
  {
    id: "acc_1",
    type: "Checking",
    number: "****4567",
    balance: 2543.87,
    currency: "USD"
  },
  {
    id: "acc_2",
    type: "Savings",
    number: "****7890",
    balance: 15750.42,
    currency: "USD"
  },
  {
    id: "acc_3",
    type: "Credit Card",
    number: "****2345",
    balance: -450.19,
    currency: "USD",
    limit: 5000
  }
];

const transactions = [
  {
    id: "tx_1",
    date: "2025-04-22",
    description: "Grocery Store",
    amount: -85.43,
    type: "debit",
    category: "Shopping"
  },
  {
    id: "tx_2",
    date: "2025-04-21",
    description: "Salary Deposit",
    amount: 3200.0,
    type: "credit",
    category: "Income"
  },
  {
    id: "tx_3",
    date: "2025-04-20",
    description: "Electric Bill",
    amount: -124.79,
    type: "debit",
    category: "Utilities"
  },
  {
    id: "tx_4",
    date: "2025-04-18",
    description: "Restaurant",
    amount: -56.2,
    type: "debit",
    category: "Dining"
  },
  {
    id: "tx_5",
    date: "2025-04-15",
    description: "Online Transfer",
    amount: -500.0,
    type: "transfer",
    category: "Transfer"
  }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
              <Shield className="h-6 w-6" />
              <span>SecureBank</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-500">john@example.com</p>
            </div>
            <div className="space-y-1 py-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "accounts" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("accounts")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Accounts
              </Button>
              <Button
                variant={activeTab === "transactions" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("transactions")}
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transactions
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
                  </Button>
                </div>
              </div>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                      <DollarSign className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$17,844.10</div>
                      <p className="text-muted-foreground text-xs">+2.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                      <CreditCard className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-muted-foreground text-xs">1 checking, 1 savings, 1 credit card</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                      <ArrowRightLeft className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-muted-foreground text-xs">5 deposits, 7 withdrawals</p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="mt-6 text-xl font-bold">Your Accounts</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{account.type}</CardTitle>
                        <CardDescription>{account.number}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                        </div>
                        {account.type === "Credit Card" && (
                          <p className="text-muted-foreground text-xs">
                            {/* Available credit: ${(account.limit + account.balance).toFixed(2)} */}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Add New Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-[140px] items-center justify-center">
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                        <Plus className="h-6 w-6" />
                        <span className="sr-only">Add account</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="mt-6 text-xl font-bold">Recent Transactions</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {transactions.slice(0, 5).map((transaction) => (
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
                              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
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
                              {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <Badge variant="outline">{transaction.category}</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-4">
                <h2 className="text-2xl font-bold">Your Accounts</h2>
                <div className="grid gap-6">
                  {accounts.map((account) => (
                    <Card key={account.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold">{account.type}</h3>
                            <p className="text-sm text-gray-500">{account.number}</p>
                          </div>
                          <div className="text-2xl font-bold">
                            {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                          </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                          <Button>View Details</Button>
                          <Button variant="outline">Transfer Money</Button>
                          <Button variant="outline">Pay Bills</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {transactions.map((transaction) => (
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
                              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
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
                              {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <Badge variant="outline">{transaction.category}</Badge>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
