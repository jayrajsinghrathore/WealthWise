"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionList } from "@/components/transaction-list"
import { FinancialCharts } from "@/components/financial-charts"
import { BalanceSummary } from "@/components/balance-summary"
import { AddTransactionButton } from "@/components/add-transaction-button"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { getTransactions } from "@/lib/transactions"
import type { Transaction } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (status === "authenticated") {
        try {
          setIsLoading(true)
          const data = await getTransactions()
          setTransactions(data)
        } catch (error) {
          console.error("Failed to fetch transactions:", error)
          toast({
            title: "Error",
            description: "Failed to fetch transactions. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTransactions()
  }, [status, toast])

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction])
    setIsAddTransactionOpen(false)
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Loading your financial data..." />
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
          <DashboardHeader heading="Dashboard" text="View and manage your financial data">
            <AddTransactionButton onClick={() => setIsAddTransactionOpen(true)} />
          </DashboardHeader>
        </motion.div>

        <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
          <BalanceSummary transactions={transactions} />
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionList transactions={transactions} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FinancialCharts transactions={transactions} chartType="pie" />
                <FinancialCharts transactions={transactions} chartType="bar" />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onAddTransaction={handleAddTransaction}
      />
    </DashboardShell>
  )
}
