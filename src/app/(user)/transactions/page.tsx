"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRightLeft, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/interceptor";

const ITEMS_PER_PAGE = 10;

interface AccountInfo {
  _id: string;
  type: string;
  number: string;
}

interface Transaction {
  _id: string;
  accountId: AccountInfo;
  amount: number;
  balance: number;
  description: string;
  category: string;
  type: "credit" | "debit" | "transfer";
  reference?: string;
  fromAccountId?: string;
  toAccountId?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const getIcon = (type: Transaction["type"]) => {
  const common = "h-4 w-4";
  switch (type) {
    case "credit":
      return <DollarSign className={`${common} text-green-600`} />;
    case "debit":
      return <DollarSign className={`${common} text-red-600`} />;
    case "transfer":
      return <ArrowRightLeft className={`${common} text-blue-600`} />;
    default:
      return <DollarSign className={`${common} text-gray-600`} />;
  }
};

const getTextColor = (type: Transaction["type"]) => {
  switch (type) {
    case "credit":
      return "text-green-600";
    case "debit":
      return "text-red-600";
    case "transfer":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const getBgColor = (type: Transaction["type"]) => {
  switch (type) {
    case "credit":
      return "bg-green-100";
    case "debit":
      return "bg-red-100";
    case "transfer":
      return "bg-blue-100";
    default:
      return "bg-gray-100";
  }
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await apiClient.get("/transactions/get");
        const fetched = res.data?.data?.transactions;
        if (Array.isArray(fetched)) {
          setTransactions(fetched);
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  return (
    <div className="container p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage your transaction history</p>
      </div>

      <div className="mb-4 flex gap-2">
        <Search className="mt-2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by description, type, or category..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md"
        />
      </div>

      <Card>
        <CardContent className="divide-y p-0">
          {isLoading ? (
            <div className="p-4 text-center">Loading transactions...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center">No transactions found</div>
          ) : (
            paginatedTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${getBgColor(tx.type)}`}>{getIcon(tx.type)}</div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()} • {tx.accountId.number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-medium ${getTextColor(tx.type)}`}>
                    {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </p>
                  <Badge variant="outline">{tx.category}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
        {!isLoading && !error && currentPage < totalPages && (
          <CardFooter className="border-t p-4">
            <Button className="w-full" variant="outline" onClick={() => setCurrentPage((prev) => prev + 1)}>
              Load More
            </Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>{selectedTransaction?.description}</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Account Number</p>
                  <p className="font-medium">{selectedTransaction.accountId.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Account Type</p>
                  <p className="font-medium capitalize">{selectedTransaction.accountId.type}</p>
                </div>
              </div>

              {/* 🆕 Show "From" and "To" only for transfers */}
              {selectedTransaction.type === "transfer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">From Account</p>
                    <p className="font-medium">{selectedTransaction.fromAccountId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">To Account</p>
                    <p className="font-medium">{selectedTransaction.toAccountId}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-sm">Amount</p>
                <p className={`font-medium ${getTextColor(selectedTransaction.type)}`}>
                  {selectedTransaction.type === "credit" ? "+" : "-"}${selectedTransaction.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Balance After</p>
                <p className="font-medium">${selectedTransaction.balance.toFixed(2)}</p>
              </div>

              {selectedTransaction.reference && (
                <div>
                  <p className="text-muted-foreground text-sm">Reference</p>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-sm">Date</p>
                <p className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Category</p>
                <p className="font-medium">{selectedTransaction.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
