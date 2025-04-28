"use client"

import { useMemo } from "react"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface DashboardProps {
  transactions: Transaction[]
}

export function Dashboard({ transactions }: DashboardProps) {
  const stats = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses

    // Get current month transactions
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const thisMonthExpenses = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      balance,
      thisMonthIncome,
      thisMonthExpenses,
      thisMonthBalance: thisMonthIncome - thisMonthExpenses,
    }
  }, [transactions])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
          <p className="text-xs text-muted-foreground">Overall financial balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">All time income</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">All time expenses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.thisMonthBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(stats.thisMonthBalance)}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Income: {formatCurrency(stats.thisMonthIncome)}</span>
            <span>Expenses: {formatCurrency(stats.thisMonthExpenses)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
