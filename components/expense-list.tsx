"use client"

import { useState } from "react"
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

interface ExpenseListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ transactions, onEdit, onDelete }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      const aValue = a[sortField]?.toString().toLowerCase() || ""
      const bValue = b[sortField]?.toString().toLowerCase() || ""
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No transactions yet. Add your first transaction to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                Date
                {sortField === "date" && (
                  <span className="ml-1 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                Type
                {sortField === "type" && (
                  <span className="ml-1 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                Category
                {sortField === "category" && (
                  <span className="ml-1 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                Amount
                {sortField === "amount" && (
                  <span className="ml-1 inline-block">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right font-medium">
                  <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(transaction.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
