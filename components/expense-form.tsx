"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Transaction, Category, TransactionType } from "@/lib/types"
import { categories } from "@/lib/data"

interface ExpenseFormProps {
  onSubmit: (transaction: Transaction) => void
  onCancel: () => void
  initialData?: Transaction | null
}

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [transaction, setTransaction] = useState<Partial<Transaction>>({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    ...initialData,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTransaction({ ...transaction, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!transaction.amount || !transaction.category || !transaction.date) {
      return
    }

    onSubmit({
      id: initialData?.id || "",
      type: transaction.type as TransactionType,
      amount: Number.parseFloat(transaction.amount as string),
      category: transaction.category as Category,
      date: transaction.date as string,
      description: transaction.description || "",
    })
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <RadioGroup
              id="type"
              name="type"
              value={transaction.type}
              onValueChange={(value) => setTransaction({ ...transaction, type: value })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={transaction.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              value={transaction.category}
              onValueChange={(value) => setTransaction({ ...transaction, category: value })}
              required
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={transaction.date} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add a description..."
              value={transaction.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"} Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
