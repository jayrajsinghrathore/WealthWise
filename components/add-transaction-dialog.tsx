"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, formatDate } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { addTransaction } from "@/lib/transactions"
import { categories } from "@/lib/data"
import type { Transaction } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTransaction: (transaction: Transaction) => void
}

export function AddTransactionDialog({ open, onOpenChange, onAddTransaction }: AddTransactionDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.amount || !formData.category || !formData.description) {
        throw new Error("Please fill in all required fields")
      }

      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      // Create transaction object
      const transaction = {
        type: formData.type as "income" | "expense",
        amount,
        category: formData.category,
        description: formData.description,
        date: formData.date.toISOString(),
      }

      // Add transaction to database
      const newTransaction = await addTransaction(transaction)

      // Update UI
      onAddTransaction(newTransaction)

      // Show success toast
      toast({
        title: "Success",
        description: "Transaction added successfully",
      })

      // Reset form
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date(),
      })
    } catch (error) {
      console.error("Error adding transaction:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add transaction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>Add a new transaction to your account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <RadioGroup
                      id="type"
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" className="border-red-500 text-red-500" />
                        <Label htmlFor="expense" className="cursor-pointer">
                          Expense
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="income" className="border-green-500 text-green-500" />
                        <Label htmlFor="income" className="cursor-pointer">
                          Income
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="border-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="border-2 focus:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="What was this for?"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="border-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-2",
                            !formData.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? formatDate(formData.date.toISOString()) : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      {isLoading ? "Adding..." : "Add Transaction"}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
