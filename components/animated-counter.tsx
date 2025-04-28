"use client"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration,
      onUpdate: (value) => setDisplayValue(value),
    })

    return () => controls.stop()
  }, [value, duration])

  return (
    <span>
      {prefix}
      {displayValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  )
}
