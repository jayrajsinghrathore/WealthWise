"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { motion } from "framer-motion"

interface FinancialChartsProps {
  transactions: Transaction[]
  chartType?: "pie" | "bar"
}

export function FinancialCharts({ transactions, chartType = "pie" }: FinancialChartsProps) {
  // Get chart settings from localStorage if available
  const getChartSettings = () => {
    if (typeof window !== "undefined") {
      const storedSettings = localStorage.getItem("chartSettings")
      if (storedSettings) {
        return JSON.parse(storedSettings)
      }
    }
    return {
      palette: "default",
      animations: true,
      transparency: 70,
    }
  }

  const chartSettings = getChartSettings()

  // Define color palettes
  const colorPalettes: Record<string, string[]> = {
    default: [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#6A0572",
      "#1A535C",
      "#F9C80E",
      "#FF8C42",
      "#A4036F",
      "#048BA8",
      "#16DB93",
    ],
    pastel: [
      "#FFB5A7",
      "#FCD5CE",
      "#F8EDEB",
      "#F9DCC4",
      "#FEC89A",
      "#D8E2DC",
      "#ECE4DB",
      "#FFE5D9",
      "#FFCAD4",
      "#F4ACB7",
    ],
    vibrant: [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FFFF33",
    ],
    monochrome: [
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#CCCCCC",
      "#1A1A1A",
      "#4D4D4D",
      "#808080",
      "#B3B3B3",
      "#E6E6E6",
    ],
    ocean: [
      "#05445E",
      "#189AB4",
      "#75E6DA",
      "#D4F1F9",
      "#B8E1ED",
      "#0C7B93",
      "#27496D",
      "#142850",
      "#00A8CC",
      "#0ABDE3",
    ],
    forest: [
      "#2D6A4F",
      "#40916C",
      "#52B788",
      "#74C69D",
      "#95D5B2",
      "#1B4332",
      "#2D6A4F",
      "#40916C",
      "#52B788",
      "#74C69D",
    ],
  }

  // Get colors based on settings
  const COLORS = colorPalettes[chartSettings.palette] || colorPalettes.default

  // Apply transparency to colors if needed
  const applyTransparency = (color: string, transparency: number) => {
    // Only apply to hex colors
    if (color.startsWith("#") && color.length === 7) {
      const alpha = Math.round(((100 - transparency) * 255) / 100)
        .toString(16)
        .padStart(2, "0")
      return `${color}${alpha}`
    }
    return color
  }

  // Process data for category pie chart
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce(
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

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  // Process data for monthly bar chart
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = {
          income: 0,
          expense: 0,
        }
      }

      if (transaction.type === "income") {
        acc[monthYear].income += transaction.amount
      } else {
        acc[monthYear].expense += transaction.amount
      }

      return acc
    },
    {} as Record<string, { income: number; expense: number }>,
  )

  const barData = Object.entries(monthlyData)
    .map(([name, { income, expense }]) => ({
      name,
      income,
      expense,
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.name.split(" ")
      const [bMonth, bYear] = b.name.split(" ")
      const aDate = new Date(`${aMonth} 1, ${aYear}`)
      const bDate = new Date(`${bMonth} 1, ${bYear}`)
      return aDate.getTime() - bDate.getTime()
    })
    .slice(-6) // Show last 6 months

  const chartTitle = chartType === "pie" ? "Expense Categories" : "Monthly Overview"
  const chartDescription =
    chartType === "pie" ? "Breakdown of your expenses by category" : "Income vs expenses over the last 6 months"

  return (
    <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chartType === "pie" ? (
          pieData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No expense data to display</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationBegin={200}
                    animationDuration={chartSettings.animations ? 1500 : 0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={applyTransparency(COLORS[index % COLORS.length], chartSettings.transparency)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), ""]}
                    labelFormatter={(name) => `Category: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )
        ) : barData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No transaction data to display</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, "")} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), ""]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={applyTransparency(COLORS[1], chartSettings.transparency)}
                  radius={[4, 4, 0, 0]}
                  animationBegin={200}
                  animationDuration={chartSettings.animations ? 1500 : 0}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill={applyTransparency(COLORS[0], chartSettings.transparency)}
                  radius={[4, 4, 0, 0]}
                  animationBegin={400}
                  animationDuration={chartSettings.animations ? 1500 : 0}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
