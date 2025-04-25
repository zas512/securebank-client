"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Shield, Users, CreditCard, ArrowRightLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RootState } from "@/redux/store";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  accountsCount: number;
  totalBalance: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="text-lg font-semibold">{user?.name ?? "Admin"}</h2>
              <p className="text-sm text-gray-500">{user?.email || "admin@example.com"}</p>
              <Badge className="mt-2">Admin</Badge>
            </div>
            <div className="space-y-1 py-2">
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("users")}
              >
                <Users className="mr-2 h-4 w-4" />
                Users
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
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">{totalUsers}</div>
                      <p className="text-muted-foreground text-xs">
                        {users.filter((u) => u.role === "admin").length} admins,{" "}
                        {users.filter((u) => u.role === "user").length} regular users
                      </p> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                      <CreditCard className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">{totalAccounts}</div>
                      <p className="text-muted-foreground text-xs">
                        Avg. {(totalAccounts / Math.max(1, users.filter((u) => u.role === "user").length)).toFixed(1)}{" "}
                        accounts per user
                      </p> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                      <ArrowRightLeft className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                      <p className="text-muted-foreground text-xs">
                        Avg. ${(totalBalance / Math.max(1, totalAccounts)).toFixed(2)} per account
                      </p> */}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                        <Input
                          placeholder="Search users by name or email..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="rounded-md border">
                      <div className="bg-muted/50 grid grid-cols-12 gap-2 border-b p-4 font-medium">
                        <div className="col-span-4">User</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Accounts</div>
                        <div className="col-span-3">Total Balance</div>
                        <div className="col-span-1" />
                      </div>
                      {/* {isLoading ? (
                        <div className="p-4 text-center">Loading users...</div>
                      ) : filteredUsers.length > 0 ? (
                        <div className="divide-y">
                          {filteredUsers.map((user) => (
                            <div key={user.id} className="grid grid-cols-12 items-center gap-2 p-4">
                              <div className="col-span-4 flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.fullName}</p>
                                  <p className="text-muted-foreground text-sm">{user.email}</p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                              </div>
                              <div className="col-span-2">{user.accountsCount}</div>
                              <div className="col-span-3">${user.totalBalance.toFixed(2)}</div>
                              <div className="col-span-1 text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/admin/users/${user.id}`}>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="sr-only">View user details</span>
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">No users found matching your search.</div>
                      )} */}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-muted-foreground text-sm">
                      {/* Showing {filteredUsers.length} of {users.length} users */}
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>View and manage all accounts in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="py-8 text-center">Account management features coming soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Monitoring</CardTitle>
                    <CardDescription>Monitor all transactions in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="py-8 text-center">Transaction monitoring features coming soon.</p>
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
