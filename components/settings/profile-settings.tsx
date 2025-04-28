"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { UserProfile } from "@/lib/types"
import { useSession } from "next-auth/react"

interface ProfileSettingsProps {
  profile: UserProfile | null
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Set profile image from session or localStorage
    if (session?.user?.image) {
      setProfileImage(session.user.image)
    } else {
      const storedImage = localStorage.getItem("profileImage")
      if (storedImage) {
        setProfileImage(storedImage)
      }
    }

    // Set name and email from session
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      })
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setProfileImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update profile in database
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          image: profileImage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Save profile image to localStorage for components that use it
      if (profileImage) {
        localStorage.setItem("profileImage", profileImage)
      }

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: profileImage,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/20 cursor-pointer" onClick={handleImageClick}>
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                    {formData.name ? getInitials(formData.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-muted-foreground">Click to upload a new profile picture</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="border-2 focus-visible:ring-primary"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
