"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

export function ChartSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [chartStyle, setChartStyle] = useState("default")
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [chartTransparency, setChartTransparency] = useState(70)

  useEffect(() => {
    // Load chart settings from localStorage if they exist
    const storedSettings = localStorage.getItem("chartSettings")
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      setChartStyle(settings.palette || "default")
      setAnimationsEnabled(settings.animations !== undefined ? settings.animations : true)
      setChartTransparency(settings.transparency || 70)
    }
  }, [])

  const colorPalettes = [
    { name: "Default", value: "default", colors: ["#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572", "#1A535C"] },
    { name: "Pastel", value: "pastel", colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4", "#FEC89A"] },
    { name: "Vibrant", value: "vibrant", colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"] },
    { name: "Monochrome", value: "monochrome", colors: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"] },
    { name: "Ocean", value: "ocean", colors: ["#05445E", "#189AB4", "#75E6DA", "#D4F1F9", "#B8E1ED"] },
    { name: "Forest", value: "forest", colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"] },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Save chart settings to localStorage
    const chartSettings = {
      palette: chartStyle,
      animations: animationsEnabled,
      transparency: chartTransparency,
    }

    localStorage.setItem("chartSettings", JSON.stringify(chartSettings))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Chart settings updated",
      description: "Your chart settings have been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-muted shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Chart Settings</CardTitle>
          <CardDescription>Customize how your financial charts look and behave</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label>Color Palette</Label>
              <RadioGroup value={chartStyle} onValueChange={setChartStyle} className="grid grid-cols-3 gap-4">
                {colorPalettes.map((palette) => (
                  <div key={palette.value}>
                    <RadioGroupItem value={palette.value} id={`palette-${palette.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`palette-${palette.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex gap-1 mb-2">
                        {palette.colors.map((color, i) => (
                          <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                        ))}
                      </div>
                      <span className="text-sm">{palette.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Chart Animations</Label>
                <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
              </div>
              <p className="text-sm text-muted-foreground">Enable or disable animations when charts are rendered</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="transparency">Chart Transparency</Label>
                <span className="text-sm text-muted-foreground">{chartTransparency}%</span>
              </div>
              <Slider
                id="transparency"
                min={0}
                max={100}
                step={5}
                value={[chartTransparency]}
                onValueChange={(value) => setChartTransparency(value[0])}
              />
              <p className="text-sm text-muted-foreground">Adjust the transparency of chart colors</p>
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
