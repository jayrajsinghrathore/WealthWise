"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MonthlyTrendsProps {
  transactions: Transaction[]
}

export function MonthlyTrends({ transactions }: MonthlyTrendsProps) {
  const monthlyData = useMemo(() => {
    // Group transactions by month
    const monthMap = transactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date)
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

        if (!acc[monthYear]) {
          acc[monthYear] = {
            income: 0,
            expense: 0,
            balance: 0,
          }
        }

        if (transaction.type === "income") {
          acc[monthYear].income += transaction.amount
        } else {
          acc[monthYear].expense += transaction.amount
        }

        acc[monthYear].balance = acc[monthYear].income - acc[monthYear].expense

        return acc
      },
      {} as Record<string, { income: number; expense: number; balance: number }>,
    )

    // Convert to array and sort by date
    return Object.entries(monthMap)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split(" ")
        const [bMonth, bYear] = b.name.split(" ")
        const aDate = new Date(`${aMonth} 1, ${aYear}`)
        const bDate = new Date(`${bMonth} 1, ${bYear}`)
        return aDate.getTime() - bDate.getTime()
      })
      .slice(-12) // Show last 12 months
  }, [transactions])

  return (
    <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Track your financial trends over the past 12 months</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        {monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No transaction data to display</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, "")} />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), ""]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#4ECDC4"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#FF6B6B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#6A0572"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
