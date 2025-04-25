"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Shield, ChevronLeft, DollarSign, ArrowRightLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RootState } from "@/redux/store";

interface Transaction {
  id: string;
  amount: number;
  balance: number;
  description: string;
  category: string;
  type: "credit" | "debit" | "transfer";
  date: string;
}

interface Account {
  id: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
  limit?: number;
  createdAt: string;
  transactions: Transaction[];
}

interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  accounts: Account[];
}

export default function UserDetailsPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  // if (error || !userDetails) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle>Error</CardTitle>
  //           <CardDescription>{error || "Failed to load user details"}</CardDescription>
  //         </CardHeader>
  //         <CardFooter>
  //           <Button onClick={() => router.push("/admin/dashboard")}>Back to Dashboard</Button>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }

  // Calculate total balance
  // const totalBalance = userDetails.accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold">
              <Shield className="h-6 w-6" />
              <span>SecureBank Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Switch to User Dashboard
            </Button>
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) ?? "A"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/admin/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                {/* <AvatarFallback>{userDetails.fullName.charAt(0)}</AvatarFallback> */}
              </Avatar>
              <div>
                {/* <h1 className="text-2xl font-bold">{userDetails.fullName}</h1> */}
                <div className="flex items-center gap-2">
                  {/* <p className="text-gray-500">{userDetails.email}</p> */}
                  {/* <Badge variant={userDetails.role === "admin" ? "default" : "outline"}>{userDetails.role}</Badge> */}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Reset Password</Button>
              <Button variant="destructive">Suspend User</Button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">User ID</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="font-mono text-sm">{userDetails.id}</div> */}
              <p className="text-muted-foreground text-xs">
                {/* Created on {new Date(userDetails.createdAt).toLocaleDateString()} */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{userDetails.accounts.length}</div> */}
              {/* <p className="text-muted-foreground text-xs">{userDetails.accounts.map((a) => a.type).join(", ")}</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div> */}
              <p className="text-muted-foreground text-xs">Across all accounts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <h2 className="text-xl font-bold">User Accounts</h2>
            {/* {userDetails.accounts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userDetails.accounts.map((account) => (
                  <Card key={account.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{account.type}</CardTitle>
                      <CardDescription>{account.number}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                      </div>
                      {account.type === "Credit Card" && account.limit && (
                        <p className="text-muted-foreground text-xs">
                          Available credit: ${(account.limit + account.balance).toFixed(2)}
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
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-medium">No Accounts</h3>
                  <p className="text-muted-foreground mt-2 text-sm">This user doesn&apos;t have any accounts yet.</p>
                </CardContent>
              </Card>
            )} */}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            {/* {userDetails.accounts.some((account) => account.transactions.length > 0) ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {userDetails.accounts
                      .flatMap((account) =>
                        account.transactions.map((transaction) => ({
                          ...transaction,
                          accountType: account.type,
                          accountNumber: account.number
                        }))
                      )
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((transaction) => (
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
                                  {transaction.accountType} ({transaction.accountNumber})
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
                              {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <ArrowRightLeft className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-medium">No Transactions</h3>
                  <p className="text-muted-foreground mt-2 text-sm">This user hasn&apos;t made any transactions yet.</p>
                </CardContent>
              </Card>
            )} */}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-bold">Activity Log</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Activity log coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
