"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { IconBrandGoogle } from "@tabler/icons-react"

export default function LoginPage() {
  const router = useRouter()
  const { initDemoData, setIsDemo } = useVehicleStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDemo = () => {
    initDemoData()
    setIsDemo(true)
    router.push("/")
    toast.success("Mode demo aktif. Data disimpan di browser.")
  }

  const handleResetDemo = () => {
    initDemoData()
    setIsDemo(true)
    router.push("/")
    toast.success("Data demo direset ke awal.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    toast.error("Fitur login akan tersedia setelah auth backend dipasang.")
    setLoading(false)
  }

  const handleGoogle = async () => {
    toast.error("Fitur login Google akan tersedia setelah auth backend dipasang.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk ke OtoNotif</CardTitle>
          <CardDescription>Pantau kesehatan kendaraan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full h-11 gap-2" onClick={handleGoogle}>
            <IconBrandGoogle className="h-5 w-5" />
            Masuk dengan Google
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">atau</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full h-11 gap-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50" onClick={handleDemo}>
              Jelajahi Demo ☕
            </Button>
            <Button variant="ghost" className="w-full h-9 text-xs text-muted-foreground" onClick={handleResetDemo}>
              Mulai Ulang Data Demo
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold underline underline-offset-2 hover:text-foreground">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
