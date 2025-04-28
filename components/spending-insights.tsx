"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { TrendingDown, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface SpendingInsightsProps {
  transactions: Transaction[]
}

export function SpendingInsights({ transactions }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    // Filter transactions from the last 3 months
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

    const recentTransactions = transactions.filter((t) => new Date(t.date) >= threeMonthsAgo)

    // Get top spending category
    const categoryExpenses = recentTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          if (!acc[t.category]) acc[t.category] = 0
          acc[t.category] += t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const topCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0] || ["None", 0]

    // Calculate month-over-month change
    const byMonth = recentTransactions.reduce(
      (acc, t) => {
        const date = new Date(t.date)
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`

        if (!acc[monthYear]) {
          acc[monthYear] = {
            income: 0,
            expense: 0,
          }
        }

        if (t.type === "income") {
          acc[monthYear].income += t.amount
        } else {
          acc[monthYear].expense += t.amount
        }

        return acc
      },
      {} as Record<string, { income: number; expense: number }>,
    )

    const months = Object.keys(byMonth).sort()

    let expenseChange = 0
    let incomeChange = 0

    if (months.length >= 2) {
      const currentMonth = byMonth[months[months.length - 1]]
      const previousMonth = byMonth[months[months.length - 2]]

      expenseChange =
        previousMonth.expense > 0 ? ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100 : 0

      incomeChange =
        previousMonth.income > 0 ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100 : 0
    }

    // Calculate average daily spending
    const totalDays = Math.max(1, Math.ceil((now.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24)))
    const totalExpenses = recentTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const averageDailySpending = totalExpenses / totalDays

    return {
      topCategory: {
        name: topCategory[0],
        amount: topCategory[1],
      },
      expenseChange,
      incomeChange,
      averageDailySpending,
    }
  }, [transactions])

  return (
    <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Key insights about your financial habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="p-4 border rounded-lg bg-card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Top Spending Category</div>
            <div className="text-2xl font-bold">{insights.topCategory.name}</div>
            <div className="text-primary mt-1">{formatCurrency(insights.topCategory.amount)}</div>
          </motion.div>

          <motion.div
            className="p-4 border rounded-lg bg-card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Monthly Expense Trend</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{Math.abs(insights.expenseChange).toFixed(1)}%</div>
              {insights.expenseChange > 0 ? (
                <TrendingUp className="ml-2 h-5 w-5 text-red-500" />
              ) : (
                <TrendingDown className="ml-2 h-5 w-5 text-green-500" />
              )}
            </div>
            <div className={insights.expenseChange > 0 ? "text-red-500" : "text-green-500"}>
              {insights.expenseChange > 0 ? "Increase" : "Decrease"} from last month
            </div>
          </motion.div>

          <motion.div
            className="p-4 border rounded-lg bg-card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Monthly Income Trend</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{Math.abs(insights.incomeChange).toFixed(1)}%</div>
              {insights.incomeChange > 0 ? (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
              )}
            </div>
            <div className={insights.incomeChange > 0 ? "text-green-500" : "text-red-500"}>
              {insights.incomeChange > 0 ? "Increase" : "Decrease"} from last month
            </div>
          </motion.div>

          <motion.div
            className="p-4 border rounded-lg bg-card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Average Daily Spending</div>
            <div className="text-2xl font-bold">{formatCurrency(insights.averageDailySpending)}</div>
            <div className="text-muted-foreground">Per day (last 3 months)</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
