"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getTransactions } from "@/lib/transactions"
import { checkAuth } from "@/lib/auth"
import type { Transaction } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialCharts } from "@/components/financial-charts"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { MonthlyTrends } from "@/components/monthly-trends"
import { SpendingInsights } from "@/components/spending-insights"
import { BarChart3, LineChart, PieChart } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.push("/login")
          return
        }

        // Fetch transactions
        const data = await getTransactions()
        setTransactions(data)
      } catch (error) {
        console.error("Analytics initialization error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [router])

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Analytics" text="Loading your financial analytics..." />
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
        <motion.div variants={item}>
          <DashboardHeader
            heading="Financial Analytics"
            text="Detailed insights into your spending patterns and financial health"
          />
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FinancialCharts transactions={transactions} chartType="pie" />
                <FinancialCharts transactions={transactions} chartType="bar" />
              </div>
              <SpendingInsights transactions={transactions} />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryBreakdown transactions={transactions} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <MonthlyTrends transactions={transactions} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardShell>
  )
}
