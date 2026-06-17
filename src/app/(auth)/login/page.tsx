"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { IconMail, IconLock, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { motion, useReducedMotion, type Variants } from "motion/react"

export default function LoginPage() {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.4,
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        ease: "easeOut",
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: shouldReduceMotion ? 0.05 : 0.3 } 
    },
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleDemo = async () => {
    setDemoLoading(true)
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Mode demo aktif.")
        window.location.href = "/dashboard"
      } else {
        toast.error(data.error || "Gagal masuk ke mode demo")
      }
    } catch {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setDemoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn.email({ email, password })
    if (error) {
      toast.error(error.message || "Email atau password salah")
      setLoading(false)
      return
    }
    router.push("/dashboard")
  }

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4 pt-1"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-1.5 mb-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground bg-clip-text">
          Masuk ke OtoNotif
        </h2>
        <p className="text-xs text-muted-foreground">
          Pantau kesehatan kendaraan Anda secara real-time
        </p>
      </motion.div>

      {/* Google Sign In */}
      <motion.div variants={itemVariants}>
        <Button
          variant="outline"
          className="w-full h-11 gap-2 text-sm font-semibold rounded-xl active:scale-[0.98] transition-transform duration-200"
          onClick={handleGoogle}
        >
          <GoogleIcon className="h-4.5 w-4.5" />
          Masuk dengan Google
        </Button>
      </motion.div>

      {/* Separator */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Separator className="flex-1 bg-border/60" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">atau</span>
        <Separator className="flex-1 bg-border/60" />
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4.5">
        <motion.div variants={itemVariants} className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email</Label>
          <InputGroup className="h-11 border-border/80 focus-within:border-amber-500/50 dark:focus-within:border-amber-500/50 focus-within:ring-amber-500/20 dark:focus-within:ring-amber-500/20 bg-background dark:bg-zinc-900/40 rounded-xl transition-all">
            <InputGroupAddon align="inline-start" className="text-zinc-400 dark:text-zinc-500">
              <IconMail className="h-4.5 w-4.5" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-sm"
            />
          </InputGroup>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
          <InputGroup className="h-11 border-border/80 focus-within:border-amber-500/50 dark:focus-within:border-amber-500/50 focus-within:ring-amber-500/20 dark:focus-within:ring-amber-500/20 bg-background dark:bg-zinc-900/40 rounded-xl transition-all">
            <InputGroupAddon align="inline-start" className="text-zinc-400 dark:text-zinc-500">
              <IconLock className="h-4.5 w-4.5" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-sm"
            />
            <InputGroupAddon align="inline-end" className="text-zinc-400 dark:text-zinc-500 pr-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 active:scale-[0.98] transition-all duration-200 mt-2 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <IconLoader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Switch Flow Link & Demo */}
      <motion.div variants={itemVariants} className="space-y-4 pt-1">
        <p className="text-xs text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline transition-colors"
          >
            Daftar Sekarang
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-border/60" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">atau</span>
          <Separator className="flex-1 bg-border/60" />
        </div>

        <Button
          variant="outline"
          className="w-full h-11 gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
          onClick={handleDemo}
          disabled={demoLoading}
        >
          {demoLoading ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              <span>Menyiapkan Demo...</span>
            </>
          ) : (
            <span>Jelajahi Demo</span>
          )}
        </Button>
      </motion.div>

    </motion.div>
  )
}
