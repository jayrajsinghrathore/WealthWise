import { signIn, signOut } from "next-auth/react"
import type { LoginCredentials, SignupData, UserProfile } from "@/lib/types"

// Sign in with credentials
export async function login(credentials: LoginCredentials): Promise<void> {
  const result = await signIn("credentials", {
    redirect: false,
    email: credentials.email,
    password: credentials.password,
  })

  if (result?.error) {
    throw new Error(result.error)
  }
}

// Sign up (create a new user)
export async function signup(data: SignupData): Promise<void> {
  // In a real app, you would register the user in your database here
  // For now, we'll just sign them in with credentials
  const result = await signIn("credentials", {
    redirect: false,
    email: data.email,
    password: data.password,
  })

  if (result?.error) {
    throw new Error(result.error)
  }
}

// Sign out
export async function logout(): Promise<void> {
  await signOut({ redirect: false })
}

// Check if the user is authenticated
export async function checkAuth(): Promise<boolean> {
  // This is handled by the middleware and useSession hook
  return true
}

// Get the user profile
export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetch("/api/user/profile")

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}
