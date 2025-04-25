"use client";
import { useState } from "react";
import { ArrowRightLeft, Filter, Search, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    accountId: "all",
    type: "all",
    category: "all",
    search: "",
    startDate: "",
    endDate: ""
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+${}</div>
                  <p className="text-muted-foreground text-xs">For selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-${}</div>
                  <p className="text-muted-foreground text-xs">For selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Change</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <div className={`text-2xl font-bold ${netChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {netChange >= 0 ? "+" : ""}
                    {netChange.toFixed(2)}
                  </div> */}
                  <p className="text-muted-foreground text-xs">Income minus expenses</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View and filter your transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                      <Input
                        placeholder="Search transactions..."
                        className="w-[200px] pl-8"
                        value={filters.search}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <Select value={filters.accountId}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {/* {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type} ({account.number})
                          </SelectItem>
                        ))} */}
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
                            <Select value={filters.type}>
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
                            <Select value={filters.category}>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {/* {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))} */}
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
                                <Input id="startDate" type="date" value={filters.startDate} placeholder="Start date" />
                              </div>
                              <div>
                                <Label htmlFor="endDate" className="sr-only">
                                  End Date
                                </Label>
                                <Input id="endDate" type="date" value={filters.endDate} placeholder="End date" />
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
                                endDate: ""
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
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <p className="text-sm text-gray-500">
                  {/* Showing {filteredTransactions.length} of {transactions.length} transactions */}
                </p>
                {/* <Button variant="outline" disabled={filteredTransactions.length >= transactions.length}>
                  Load More
                </Button> */}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
