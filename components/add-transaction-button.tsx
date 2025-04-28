"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface AddTransactionButtonProps {
  onClick: () => void
}

export function AddTransactionButton({ onClick }: AddTransactionButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onClick}
        className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 group"
      >
        <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        Add Transaction
      </Button>
    </motion.div>
  )
}
