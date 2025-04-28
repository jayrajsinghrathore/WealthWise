"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserProfile, logout } from "@/lib/auth"
import type { UserProfile } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSignOut = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Profile" text="Loading your profile information..." />
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your account settings" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View and update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.email || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-since">Member Since</Label>
              <Input
                id="member-since"
                value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Update Profile</Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
