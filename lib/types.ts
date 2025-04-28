export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}
