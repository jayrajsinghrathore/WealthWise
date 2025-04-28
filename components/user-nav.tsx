"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"

export function UserNav() {
  const router = useRouter()
  const { data: session } = useSession()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's a stored profile image in localStorage
    const storedImage = localStorage.getItem("profileImage")
    if (storedImage) {
      setProfileImage(storedImage)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src={session?.user?.image || profileImage || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {session?.user?.name ? getInitials(session.user.name) : "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{session?.user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
