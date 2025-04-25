"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import apiClient from "@/lib/interceptor";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

type Account = {
  _id: string;
  userId?: string;
  name?: string;
  type: string;
  number?: string;
  balance: number;
  currency?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TransactionAccountRef = {
  _id: string;
  userId?: string;
  type: string;
  number?: string;
};

type Transaction = {
  _id: string;
  accountId: string | TransactionAccountRef;
  amount: number;
  balance?: number;
  description?: string;
  category?: string;
  type: "credit" | "debit";
  reference?: string;
  date?: string;
  fromAccountId?: string | TransactionAccountRef;
  toAccountId?: string | TransactionAccountRef;
};

type User = {
  id: string;
  name?: string;
  email: string;
};

type UserData = {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
};

type TotalStats = {
  users: number;
  accounts: number;
  transactions: number;
  totalBalance: number;
};

type ChartData = {
  name: string;
  accounts: number;
  transactions: number;
  balance: number;
};

type AccountDetails = {
  id: string;
  type: string;
  number: string;
};

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalStats, setTotalStats] = useState<TotalStats>({
    users: 0,
    accounts: 0,
    transactions: 0,
    totalBalance: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get<{ data: UserData[] }>("/admin/fetch-everything");
        if (res.data?.data && Array.isArray(res.data.data)) {
          setUserData(res.data.data);
          calculateStats(res.data.data);
        } else {
          console.warn("Unexpected response format:", res.data);
          setUserData([]);
          setError("Invalid data format received from server");
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Failed to fetch users:", error);
        setError(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (data: UserData[]) => {
      const stats = data.reduce(
        (acc, user) => {
          const userAccounts = user.accounts || [];
          const userTransactions = user.transactions || [];
          const totalBalance = userAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
          return {
            users: acc.users + 1,
            accounts: acc.accounts + userAccounts.length,
            transactions: acc.transactions + userTransactions.length,
            totalBalance: acc.totalBalance + totalBalance
          };
        },
        { users: 0, accounts: 0, transactions: 0, totalBalance: 0 }
      );
      setTotalStats(stats);
    };
    fetchUsers();
  }, []);

  const getChartData = (): ChartData[] => {
    if (!userData.length) return [];
    return userData.map((user) => ({
      name: user.user?.name ?? user.user?.email?.split("@")[0] ?? "Unknown",
      accounts: user.accounts?.length || 0,
      transactions: user.transactions?.length || 0,
      balance: user.accounts?.reduce((total, acc) => total + (acc.balance || 0), 0) || 0
    }));
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getAccountDetails = (accountId: string | TransactionAccountRef): AccountDetails => {
    if (!accountId) return { id: "Unknown", type: "Unknown", number: "Unknown" };
    if (typeof accountId === "object") {
      return {
        id: accountId._id ?? "Unknown",
        type: accountId.type ?? "Unknown",
        number: accountId.number ?? "Unknown"
      };
    }
    return { id: accountId, type: "Unknown", number: "Unknown" };
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p>{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="space-y-4 pt-4">
            <p>Loading Data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData.length) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-center">
            <div className="space-y-4 py-8">
              <p className="text-muted-foreground">No user data available at the moment.</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="space-y-6 p-6">
      <section className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="ghost"
          className="justify-start text-lg text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.accounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.transactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.totalBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>User Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accounts" fill="#8884d8" name="Accounts" />
                  <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                  <Bar dataKey="balance" fill="#ffc658" name="Balance ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User List */}
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userData.map((user) => {
          const userAccounts = user.accounts || [];
          const userTransactions = user.transactions || [];
          const totalBalance = userAccounts.reduce((total, account) => total + (account.balance || 0), 0);

          return (
            <Card key={user.user.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center justify-between">
                  <span>{user.user.name ?? user.user.email.split("@")[0]}</span>
                  {!userAccounts.length && <Badge variant="outline">No Accounts</Badge>}
                </CardTitle>
                <p className="text-muted-foreground text-sm">{user.user.email}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Accounts</p>
                    <p className="text-xl font-semibold">{userAccounts.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Balance</p>
                    <p className="text-xl font-semibold">${totalBalance.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Recent Activity</p>
                  <p className="text-sm">
                    {userTransactions.length > 0 ? `${userTransactions.length} transactions` : "No transactions"}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>
                        {user.user.name ?? "User"} - {user.user.email}
                      </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="accounts" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="accounts">Accounts ({userAccounts.length})</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions ({userTransactions.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="accounts">
                        <ScrollArea className="h-[60vh] pr-4">
                          {!userAccounts.length ? (
                            <div className="text-muted-foreground py-8 text-center">No accounts found</div>
                          ) : (
                            <div className="space-y-4 py-4">
                              {userAccounts.map((account) => (
                                <Card key={account._id}>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="flex justify-between text-lg">
                                      <span>{account.name ?? (account.type || "Account")}</span>
                                      <Badge variant={account.status !== false ? "default" : "destructive"}>
                                        {account.status !== false ? "Active" : "Inactive"}
                                      </Badge>
                                    </CardTitle>
                                    <p className="text-muted-foreground text-sm">
                                      {account.number ? `Account #${account.number}` : "No account number"}
                                    </p>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-muted-foreground text-sm font-medium">Type</p>
                                        <p className="capitalize">{account.type || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-sm font-medium">Balance</p>
                                        <p className="font-semibold">
                                          {account.currency ?? "$"} {account.balance?.toFixed(2) || "0.00"}
                                        </p>
                                      </div>
                                      {account.createdAt && (
                                        <div className="col-span-2">
                                          <p className="text-muted-foreground text-sm font-medium">Created</p>
                                          <p className="text-sm">{formatDate(account.createdAt)}</p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="transactions">
                        <ScrollArea className="h-[60vh] pr-4">
                          {!userTransactions.length ? (
                            <div className="text-muted-foreground py-8 text-center">No transactions found</div>
                          ) : (
                            <div className="space-y-4 py-4">
                              {userTransactions.map((transaction) => {
                                const accountDetails = getAccountDetails(transaction.accountId);

                                return (
                                  <Card key={transaction._id}>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="flex justify-between text-base">
                                        <span>{transaction.description ?? "Transaction"}</span>
                                        <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                                          {transaction.type === "credit" ? "Credit" : "Debit"}
                                        </Badge>
                                      </CardTitle>
                                      <p className="text-muted-foreground text-sm">
                                        {formatDate(transaction.date)}
                                        {transaction.category ? ` • ${transaction.category}` : ""}
                                      </p>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-muted-foreground text-sm font-medium">Amount</p>
                                          <p
                                            className={`font-semibold ${
                                              transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                            }`}
                                          >
                                            {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                          </p>
                                        </div>
                                        {typeof transaction.balance === "number" && (
                                          <div>
                                            <p className="text-muted-foreground text-sm font-medium">Balance</p>
                                            <p className="font-semibold">${transaction.balance.toFixed(2)}</p>
                                          </div>
                                        )}
                                        <div className="col-span-2">
                                          <p className="text-muted-foreground text-sm font-medium">Account</p>
                                          <p className="text-sm">
                                            {accountDetails.type}{" "}
                                            {accountDetails.number !== "Unknown" ? `(${accountDetails.number})` : ""}
                                          </p>
                                        </div>
                                        {transaction.reference && (
                                          <div className="col-span-2">
                                            <p className="text-muted-foreground text-sm font-medium">Reference</p>
                                            <p className="text-sm">{transaction.reference}</p>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
