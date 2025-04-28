"use client"

import { motion } from "framer-motion"
import type React from "react"

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
}

export function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
