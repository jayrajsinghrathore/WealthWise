"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, Search, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { deleteTransaction } from "@/lib/transactions"
import { useToast } from "@/components/ui/use-toast"
import { ExpenseForm } from "@/components/expense-form"

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        setIsLoading(id)
        await deleteTransaction(id)

        // Show success toast
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })

        // Refresh the page to get updated data
        window.location.reload()
      } catch (error) {
        console.error("Error deleting transaction:", error)
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        })
      } finally {
        setIsLoading(null)
      }
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditCancel = () => {
    setEditingTransaction(null)
  }

  const handleEditSubmit = (transaction: Transaction) => {
    // The transaction will be updated via the form component
    setEditingTransaction(null)

    // Show success toast
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    })

    // Refresh the page to get updated data
    window.location.reload()
  }

  return (
    <>
      <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>You have made {transactions.length} transactions</CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 bg-background border-2 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No transactions found</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                      whileHover={{ backgroundColor: "rgba(var(--muted), 0.3)" }}
                    >
                      <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {transaction.type === "expense" ? (
                            <motion.div
                              animate={{ y: [0, 2, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            >
                              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            >
                              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                            </motion.div>
                          )}
                          <span className={transaction.type === "expense" ? "text-red-500" : "text-green-500"}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={isLoading === transaction.id}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editingTransaction && (
        <ExpenseForm onSubmit={handleEditSubmit} onCancel={handleEditCancel} initialData={editingTransaction} />
      )}
    </>
  )
}
