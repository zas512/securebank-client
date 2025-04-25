"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Download, Filter, ChevronLeft, DollarSign, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardHeader } from "@/components/dashboard-header";
import type { RootState } from "@/redux/store";

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
  },
  {
    id: "tx_6",
    date: "2025-04-10",
    description: "ATM Withdrawal",
    amount: -200.0,
    type: "debit",
    category: "Cash"
  },
  {
    id: "tx_7",
    date: "2025-04-05",
    description: "Online Shopping",
    amount: -89.99,
    type: "debit",
    category: "Shopping"
  },
  {
    id: "tx_8",
    date: "2025-04-01",
    description: "Interest Payment",
    amount: 12.45,
    type: "credit",
    category: "Interest"
  }
];

export default function AccountStatementPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const [statement, setStatement] = useState({
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    transactions: transactions
  });
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    search: ""
  });

  useEffect(() => {
    if (!user?.id) {
      router.push("/login");
    }
  }, [router, user.id]);

  const handleDateChange = (name: string, value: string) => {
    setStatement((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const filteredTransactions = statement.transactions.filter((transaction) => {
    // Filter by type
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    // Filter by category
    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false;
    }

    // Filter by search term
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });

  const totalIncome = filteredTransactions.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions.filter((tx) => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);

  const downloadStatement = () => {
    // In a real app, this would generate and download a PDF statement
    alert("Statement download functionality would be implemented here");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="container flex-1 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/accounts">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Accounts
            </Link>
          </Button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{} Account Statement</h1>
              <p className="text-gray-500">Account Number: {}</p>
            </div>
            <Button onClick={downloadStatement}>
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${}</div>
              <p className="text-muted-foreground text-xs">As of {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${totalIncome.toFixed(2)}</div>
              <p className="text-muted-foreground text-xs">For selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
              <p className="text-muted-foreground text-xs">For selected period</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statement Period</CardTitle>
            <CardDescription>Select the date range for your statement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={statement.startDate}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={statement.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full md:w-auto">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} transactions from{" "}
                  {new Date(statement.startDate).toLocaleDateString()} to{" "}
                  {new Date(statement.endDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full md:w-auto"
                />
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
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Dining">Dining</SelectItem>
                            <SelectItem value="Transfer">Transfer</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Interest">Interest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setFilters({ type: "all", category: "all", search: "" })}
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
            <div className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <p className="text-sm text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <Button variant="outline" disabled>
              Load More
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
