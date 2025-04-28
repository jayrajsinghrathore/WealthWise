"use client"

import { useMemo } from "react"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { categoryColors } from "@/lib/data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ExpenseChartProps {
  transactions: Transaction[]
  chartType?: "pie" | "bar"
}

export function ExpenseChart({ transactions, chartType = "pie" }: ExpenseChartProps) {
  const expenseData = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter((t) => t.type === "expense")

    if (chartType === "pie") {
      // Group by category
      const categoryMap = expenses.reduce(
        (acc, transaction) => {
          const { category, amount } = transaction
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += amount
          return acc
        },
        {} as Record<string, number>,
      )

      // Convert to array for chart
      return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }))
    } else {
      // Group by month for bar chart
      const monthMap = expenses.reduce(
        (acc, transaction) => {
          const date = new Date(transaction.date)
          const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

          if (!acc[monthYear]) {
            acc[monthYear] = 0
          }
          acc[monthYear] += transaction.amount
          return acc
        },
        {} as Record<string, number>,
      )

      // Convert to array and sort by date
      return Object.entries(monthMap)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.name.split(" ")
          const [bMonth, bYear] = b.name.split(" ")
          const aDate = new Date(`${aMonth} 1, ${aYear}`)
          const bDate = new Date(`${bMonth} 1, ${bYear}`)
          return aDate.getTime() - bDate.getTime()
        })
        .slice(-6) // Show last 6 months
    }
  }, [transactions, chartType])

  if (transactions.filter((t) => t.type === "expense").length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No expense data to display</p>
      </div>
    )
  }

  if (chartType === "pie") {
    return (
      <ChartContainer className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || `hsl(${index * 45}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <div className="font-medium">{payload[0].name}</div>
                        <div>{formatCurrency(payload[0].value as number)}</div>
                      </ChartTooltipContent>
                    </ChartTooltip>
                  )
                }
                return null
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={expenseData}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, "")} />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), "Expenses"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="value" fill="hsl(215, 70%, 60%)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
