"use client";
import { CreditCard, ArrowRightLeft, Plus, ChevronRight, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import apiClient from "@/lib/interceptor";

type Account = {
  name: string;
  number: string;
  balance: number;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit" | "transfer";
  category: string;
};

type DashboardData = {
  totalBalance: number;
  activeAccounts: {
    count: number;
    breakdown: Record<string, number>;
  };
  recentTransactionsOverview: {
    total: number;
    deposits: number;
    withdrawals: number;
  };
  accounts: Account[];
  recentTransactions: Transaction[];
};
// uses your authenticated client

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get("/overview/get-overview");
        if (res.data?.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboard();
  }, []);

  const accounts = dashboardData?.accounts || [];
  const transactions = dashboardData?.recentTransactions || [];

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <div className="flex gap-2">
                <Link href="/accounts">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData?.totalBalance?.toFixed(2) ?? "0.00"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.activeAccounts?.count ?? 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                  <ArrowRightLeft className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.recentTransactionsOverview?.total ?? 0}</div>
                </CardContent>
              </Card>
            </div>

            <h2 className="mt-6 text-xl font-bold">Your Accounts</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <Card key={account.number}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>{account.number}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${account.balance?.toFixed(2) ?? "0.00"}</div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No accounts available.</p>
              )}
            </div>

            <h2 className="mt-6 text-xl font-bold">Recent Transactions</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((tx) => {
                      let bgColorClass = "bg-blue-100";
                      let icon = <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
                      let textColorClass = "text-blue-600";

                      if (tx.type === "credit") {
                        bgColorClass = "bg-green-100";
                        icon = <DollarSign className="h-4 w-4 text-green-600" />;
                        textColorClass = "text-green-600";
                      } else if (tx.type === "debit") {
                        bgColorClass = "bg-red-100";
                        icon = <DollarSign className="h-4 w-4 text-red-600" />;
                        textColorClass = "text-red-600";
                      }

                      return (
                        <div key={tx.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className={`rounded-full p-2 ${bgColorClass}`}>{icon}</div>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className={`font-medium ${textColorClass}`}>
                              {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                            </p>
                            <Badge variant="outline">{tx.category}</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground p-4">No recent transactions.</div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Link href="/transactions" className="w-full cursor-pointer">
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
