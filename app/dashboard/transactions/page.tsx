"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionList } from "@/components/transaction-list"
import { AddTransactionButton } from "@/components/add-transaction-button"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { getTransactions } from "@/lib/transactions"
import { checkAuth } from "@/lib/auth"
import type { Transaction } from "@/lib/types"

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

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

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
        console.error("Transactions initialization error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [router])

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction])
    setIsAddTransactionOpen(false)
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Transactions" text="Loading your transactions..." />
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
          <DashboardHeader heading="Transactions" text="View and manage your transactions">
            <AddTransactionButton onClick={() => setIsAddTransactionOpen(true)} />
          </DashboardHeader>
        </motion.div>

        <motion.div variants={item}>
          <TransactionList transactions={transactions} />
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
