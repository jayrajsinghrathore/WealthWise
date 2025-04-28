"use client"

import { useMemo } from "react"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"

interface BalanceSummaryProps {
  transactions: Transaction[]
}

export function BalanceSummary({ transactions }: BalanceSummaryProps) {
  const summary = useMemo(() => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <>
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="bg-primary/10 p-2 rounded-full"
            >
              <DollarSign className="h-4 w-4 text-primary" />
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              <AnimatedCounter value={summary.balance} prefix="$" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Overall financial balance</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-2 border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="bg-green-500/10 p-2 rounded-full"
            >
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-500">
              <AnimatedCounter value={summary.totalIncome} prefix="$" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">All time income</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-2 border-red-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="bg-red-500/10 p-2 rounded-full"
            >
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-500">
              <AnimatedCounter value={summary.totalExpenses} prefix="$" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">All time expenses</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
