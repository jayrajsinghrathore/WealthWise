import type { Transaction } from "@/lib/types"

// Get all transactions for the authenticated user
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch transactions")
  }

  const data = await response.json()

  // Convert date strings to proper format
  return data.map((transaction: any) => ({
    ...transaction,
    date: new Date(transaction.date).toISOString(),
    createdAt: new Date(transaction.createdAt).toISOString(),
  }))
}

// Add a new transaction
export async function addTransaction(
  transactionData: Omit<Transaction, "id" | "userId" | "createdAt">,
): Promise<Transaction> {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add transaction")
  }

  const data = await response.json()

  // Convert date strings to proper format
  return {
    ...data,
    date: new Date(data.date).toISOString(),
    createdAt: new Date(data.createdAt).toISOString(),
  }
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete transaction")
  }
}

// Update a transaction
export async function updateTransaction(
  id: string,
  transactionData: Omit<Transaction, "id" | "userId" | "createdAt">,
): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update transaction")
  }

  const data = await response.json()

  // Convert date strings to proper format
  return {
    ...data,
    date: new Date(data.date).toISOString(),
    createdAt: new Date(data.createdAt).toISOString(),
  }
}
