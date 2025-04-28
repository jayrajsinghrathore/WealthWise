"use client"

import { motion } from "framer-motion"

export function AnimatedGradientBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-black/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-muted animate-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </>
  )
}
