"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LineChart, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: BarChart3,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: LineChart,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
              pathname === item.href
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </motion.div>
        </Link>
      ))}
    </nav>
  )
}
