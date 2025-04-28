"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface CategoryBreakdownProps {
  transactions: Transaction[]
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const categoryData = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter((t) => t.type === "expense")
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

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

    // Convert to array for display
    return Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  // Vibrant colors for categories
  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-teal-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-green-500",
      "bg-cyan-500",
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Detailed analysis of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No expense data to display</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categoryData.map((category, index) => (
              <motion.div
                key={category.name}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)} mr-2`}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{formatCurrency(category.amount)}</span>
                    <span className="text-muted-foreground text-sm ml-2">({category.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
