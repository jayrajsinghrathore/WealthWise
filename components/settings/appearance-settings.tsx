"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Check, Loader2, Moon, Sun, Monitor } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")
  const [selectedAccent, setSelectedAccent] = useState("emerald")

  useEffect(() => {
    // Load accent color from localStorage if it exists
    const storedAccent = localStorage.getItem("accentColor")
    if (storedAccent) {
      setSelectedAccent(storedAccent)
    }

    // Set the theme based on the current theme
    setSelectedTheme(theme || "system")
  }, [theme])

  const accentColors = [
    { name: "Emerald", value: "emerald", class: "bg-emerald-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Rose", value: "rose", class: "bg-rose-500" },
    { name: "Amber", value: "amber", class: "bg-amber-500" },
    { name: "Cyan", value: "cyan", class: "bg-cyan-500" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Apply theme
    setTheme(selectedTheme)

    // Save accent color to localStorage
    localStorage.setItem("accentColor", selectedAccent)

    // Apply accent color to CSS variables
    document.documentElement.style.setProperty("--accent-color", selectedAccent)

    // Simulate API call for accent color
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                <ThemeOption
                  title="Light"
                  icon={<Sun className="h-5 w-5" />}
                  isSelected={selectedTheme === "light"}
                  onClick={() => setSelectedTheme("light")}
                />
                <ThemeOption
                  title="Dark"
                  icon={<Moon className="h-5 w-5" />}
                  isSelected={selectedTheme === "dark"}
                  onClick={() => setSelectedTheme("dark")}
                />
                <ThemeOption
                  title="System"
                  icon={<Monitor className="h-5 w-5" />}
                  isSelected={selectedTheme === "system"}
                  onClick={() => setSelectedTheme("system")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Accent Color</Label>
              <RadioGroup value={selectedAccent} onValueChange={setSelectedAccent} className="grid grid-cols-3 gap-4">
                {accentColors.map((color) => (
                  <div key={color.value}>
                    <RadioGroupItem value={color.value} id={`color-${color.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`color-${color.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full ${color.class}`}></div>
                      <span className="mt-2">{color.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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

interface ThemeOptionProps {
  title: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function ThemeOption({ title, icon, isSelected, onClick }: ThemeOptionProps) {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer hover:border-primary/50 ${
        isSelected ? "border-primary bg-primary/5" : "border-muted"
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      <div className="rounded-full bg-muted p-2">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  )
}
