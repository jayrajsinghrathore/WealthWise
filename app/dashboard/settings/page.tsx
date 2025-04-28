"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { checkAuth, getUserProfile } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { ChartSettings } from "@/components/settings/chart-settings"
import { Palette, User, BarChart } from "lucide-react"
import type { UserProfile } from "@/lib/types"

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

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.push("/login")
          return
        }

        // Fetch user profile
        const userProfile = await getUserProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Settings initialization error:", error)
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
        <DashboardHeader heading="Settings" text="Loading your settings..." />
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
          <DashboardHeader heading="Settings" text="Customize your experience" />
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Charts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings profile={profile} />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <ChartSettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardShell>
  )
}
