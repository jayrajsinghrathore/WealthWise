"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Github, Linkedin, PieChart, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedText } from "@/components/animated-text"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <Link href="/" className="flex items-center justify-center">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/70 text-white rounded-full p-2">
              <Sparkles className="h-6 w-6" />
            </div>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          >
            WealthWise
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              {session ? "Dashboard" : "Log In"}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={session ? "/dashboard" : "/signup"}>
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                {session ? "Go to Dashboard" : "Sign Up"}
              </Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ThemeToggle />
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <AnimatedGradientBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <AnimatedText
                    text="Master Your Money, Shape Your Future"
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  />
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track your spending, visualize your habits, and achieve your financial goals with our intuitive and
                    powerful personal finance app.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 group"
                      >
                        Start For Free
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="transition-all duration-300 hover:shadow-md">
                        Log In
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl"></div>
                  <img
                    src="https://cdn.dribbble.com/userupload/6861708/file/original-50ce905d5c193a02fd2a936f1dcf93b6.jpg"
                    alt="Dashboard Preview"
                    className="object-cover w-full h-full rounded-xl shadow-2xl shadow-primary/20 transition-transform duration-500 hover:scale-105"
                  />
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/30 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <AnimatedText
                  text="Powerful Features for Your Financial Journey"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your money effectively in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <AnimatedCard delay={0.1}>
                <div className="flex flex-col items-center space-y-2 rounded-lg border-2 border-primary/10 p-6 shadow-sm bg-card hover:shadow-lg transition-all duration-300 h-full">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Tracking</h3>
                  <p className="text-center text-muted-foreground">
                    Effortlessly record and categorize your income and expenses with our intelligent transaction system.
                  </p>
                </div>
              </AnimatedCard>
              <AnimatedCard delay={0.2}>
                <div className="flex flex-col items-center space-y-2 rounded-lg border-2 border-primary/10 p-6 shadow-sm bg-card hover:shadow-lg transition-all duration-300 h-full">
                  <div className="rounded-full bg-primary/10 p-3">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Visual Insights</h3>
                  <p className="text-center text-muted-foreground">
                    Understand your spending habits with beautiful interactive charts and personalized financial
                    insights.
                  </p>
                </div>
              </AnimatedCard>
              <AnimatedCard delay={0.3}>
                <div className="flex flex-col items-center space-y-2 rounded-lg border-2 border-primary/10 p-6 shadow-sm bg-card hover:shadow-lg transition-all duration-300 h-full">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Secure & Private</h3>
                  <p className="text-center text-muted-foreground">
                    Your financial data is protected with industry-standard security and never shared with third
                    parties.
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <motion.div
            className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
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
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <AnimatedText
                  text="Ready to Transform Your Finances?"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who have taken control of their financial future with WealthWise.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      Create Free Account
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6 bg-background">
        <div className="flex items-center">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="mr-2">
            <div className="bg-gradient-to-br from-primary to-primary/70 text-white rounded-full p-1">
              <Sparkles className="h-4 w-4" />
            </div>
          </motion.div>
          <p className="text-xs text-muted-foreground">© 2023 WealthWise. All rights reserved.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link
            href="https://github.com/jayrajsinghrathore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jayraj-singh-rathore-786b13217/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}
