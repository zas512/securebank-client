"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/lib/interceptor";

// Types
interface Account {
  _id: string;
  name?: string;
  type: "Checking" | "Savings" | "Credit Card";
  number: string;
  balance: number;
  currency: string;
  userId: string;
  status?: boolean;
  limit?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AddAccountDialogProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (isOpen: boolean) => void;
  readonly onAccountAdded: () => void;
}

interface ViewAccountDialogProps {
  readonly account: Account | null;
  readonly onClose: () => void;
}

function AddAccountDialog({ isOpen, onOpenChange, onAccountAdded }: AddAccountDialogProps) {
  const [accountType, setAccountType] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiClient.post("/accounts/create-account", {
        type: accountType,
        pin,
        name: accountName || undefined
      });

      if (response.data.success) {
        onAccountAdded();
        onOpenChange(false);
        setAccountType("");
        setAccountName("");
        setPin("");
      } else {
        setSubmitError(response.data.message ?? "Failed to add account");
      }
    } catch (err) {
      setSubmitError("Failed to add account");
      console.error("Error adding account:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>Select the account type, enter an optional name, and your PIN.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountType" className="text-right">
                Account Type
              </Label>
              <Select required value={accountType} onValueChange={setAccountType}>
                <SelectTrigger id="accountType" className="col-span-3 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountName" className="text-right">
                Name (Optional)
              </Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., My Main Checking"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pin" className="text-right">
                PIN
              </Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="col-span-3"
                maxLength={4}
              />
            </div>
          </div>
          {submitError && <p className="mb-4 text-center text-sm text-red-500">{submitError}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !accountType || !pin}>
              {isSubmitting ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ViewAccountDialog({ account, onClose }: ViewAccountDialogProps) {
  if (!account) return null;

  return (
    <Dialog open={!!account} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>Here&apos;s everything about this account.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {account._id}
          </p>
          <p>
            <strong>Type:</strong> {account.type}
          </p>
          <p>
            <strong>Balance:</strong> ${account.balance.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {account.status ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Currency:</strong> {account.currency}
          </p>
          {account.limit && (
            <p>
              <strong>Limit:</strong> ${account.limit}
            </p>
          )}
          {account.createdAt && (
            <p>
              <strong>Created:</strong> {new Date(account.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({
  account,
  isOpen,
  onClose,
  onTransferSuccess
}: Readonly<{
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onTransferSuccess: () => void;
}>) {
  const [targetAccountNumber, setTargetAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiClient.post("/accounts/transfer-money", {
        fromAccountId: account?._id,
        toAccountId: targetAccountNumber,
        amount: Number.parseFloat(amount),
        pin,
        description
      });
      if (res.data.success) {
        onTransferSuccess();
        onClose();
        setTargetAccountNumber("");
        setAmount("");
        setPin("");
        setDescription("");
      } else {
        setError(res.data.message ?? "Transfer failed");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setError("Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Amount</DialogTitle>
          <DialogDescription>Send money from this account to another account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <Label className="mb-2">Target Account Number</Label>
            <Input
              type="text"
              value={targetAccountNumber}
              onChange={(e) => setTargetAccountNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2">Amount</Label>
            <Input
              type="number"
              min={0.01}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2">Description (Optional)</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Rent payment, groceries, etc."
            />
          </div>
          <div>
            <Label className="mb-2">PIN</Label>
            <Input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TransactionDialog({
  account,
  isOpen,
  onClose,
  onTransactionSuccess
}: Readonly<{
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onTransactionSuccess: () => void;
}>) {
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiClient.post("/transactions/do-transaction", {
        accountId: account?._id,
        type,
        amount: Number.parseFloat(amount),
        pin,
        description
      });

      if (res.data.success) {
        onTransactionSuccess();
        onClose();
        setAmount("");
        setPin("");
        setDescription("");
        setType("deposit");
      } else {
        setError(res.data.message ?? "Transaction failed");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setError("Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit / Withdraw</DialogTitle>
          <DialogDescription>Enter transaction details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleTransaction} className="space-y-4">
          <div>
            <Label className="mb-2">Transaction Type</Label>
            <Select value={type} onValueChange={(val: "deposit" | "withdraw") => setType(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdraw">Withdraw</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Amount</Label>
            <Input
              type="number"
              min={0.01}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2">Description (Optional)</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., ATM deposit, bill payment..."
            />
          </div>
          <div>
            <Label className="mb-2">PIN</Label>
            <Input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transferAccount, setTransferAccount] = useState<Account | null>(null);
  const [selectedTransactionAccount, setSelectedTransactionAccount] = useState<Account | null>(null);

  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/accounts/get-accounts");
      if (response.data.success) {
        setAccounts(response.data.data.accounts ?? []);
      } else {
        setError(response.data.message ?? "Failed to fetch accounts");
        setAccounts([]);
      }
    } catch (err) {
      setError("Failed to fetch accounts");
      console.error("Fetch error:", err);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const filteredAccounts = accounts.filter((account) => {
    if (activeTab === "all") return true;
    if (activeTab === "checking") return account.type === "Checking";
    if (activeTab === "savings") return account.type === "Savings";
    if (activeTab === "credit") return account.type === "Credit Card";
    return true;
  });

  return (
    <>
      <div className="container p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Accounts</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Accounts</TabsTrigger>
              <TabsTrigger value="checking">Checking</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="credit">Credit Cards</TabsTrigger>
            </TabsList>
            <Button onClick={() => setIsAddAccountDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading && <p>Loading accounts...</p>}
            {error && <p className="text-red-500">Error loading accounts: {error}</p>}
            {!isLoading && !error && filteredAccounts.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">No accounts found. Add your first account!</p>
                </CardContent>
              </Card>
            )}
            {!isLoading && !error && filteredAccounts.length > 0 && (
              <div className="grid gap-4">
                {filteredAccounts.map((account) => (
                  <Card key={account._id}>
                    <CardHeader className="pb-0">
                      <CardTitle className="text-lg">
                        {account.name ? `${account.name} (${account.type})` : account.type}
                      </CardTitle>
                      <p className="text-muted-foreground">{account._id}</p>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-2xl font-bold">
                        {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                      </div>
                    </CardContent>
                    <div className="border-t px-6 pt-4 pb-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="px-3" onClick={() => setSelectedAccount(account)}>
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="px-3" onClick={() => setTransferAccount(account)}>
                          Transfer Amount
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTransactionAccount(account)}>
                          Deposit / Withdraw
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddAccountDialog
        isOpen={isAddAccountDialogOpen}
        onOpenChange={setIsAddAccountDialogOpen}
        onAccountAdded={refreshAccounts}
      />

      <TransferDialog
        account={transferAccount}
        isOpen={!!transferAccount}
        onClose={() => setTransferAccount(null)}
        onTransferSuccess={refreshAccounts}
      />

      <TransactionDialog
        account={selectedTransactionAccount}
        isOpen={!!selectedTransactionAccount}
        onClose={() => setSelectedTransactionAccount(null)}
        onTransactionSuccess={refreshAccounts}
      />

      <ViewAccountDialog account={selectedAccount} onClose={() => setSelectedAccount(null)} />
    </>
  );
}
