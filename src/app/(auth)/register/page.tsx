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
import { signUp, signIn } from "@/lib/auth-client"
import { IconBrandGoogle } from "@tabler/icons-react"

export default function RegisterPage() {
  const router = useRouter()
  const { initDemoData, setIsDemo } = useVehicleStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDemo = () => {
    initDemoData()
    setIsDemo(true)
    router.push("/")
    toast.success("Mode demo aktif. Data disimpan di browser.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signUp.email({ name, email, password })
    if (error) {
      toast.error(error.message || "Gagal mendaftar")
      setLoading(false)
      return
    }
    setIsDemo(false)
    router.push("/")
  }

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <CardDescription>Daftar untuk menyimpan data kendaraan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full h-11 gap-2" onClick={handleGoogle}>
            <IconBrandGoogle className="h-5 w-5" />
            Daftar dengan Google
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">atau</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" type="text" placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <Separator />

          <Button variant="outline" className="w-full h-11 gap-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50" onClick={handleDemo}>
            Jelajahi Demo ☕
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold underline underline-offset-2 hover:text-foreground">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
