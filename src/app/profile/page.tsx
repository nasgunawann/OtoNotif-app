"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconUserCircle, IconSettings, IconLogout, IconSun, IconEdit, IconChevronRight } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion } from "motion/react"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { FormDialog } from "@/components/forms/FormDialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { userName, setUserName } = useVehicleStore()
  const [nameInput, setNameInput] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (session?.user?.name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNameInput(session.user.name)
    } else if (userName) {
      setNameInput(userName)
    }
  }, [session, userName])


  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Berhasil keluar")
      router.replace("/login")
    } catch {
      toast.error("Gagal keluar")
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) {
      toast.error("Nama tidak boleh kosong")
      return
    }
    setUserName(nameInput.trim())
    setOpen(false)
    toast.success("Nama profil berhasil diperbarui")
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-20 md:pb-0"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-sm text-muted-foreground">Kelola pengaturan akun Anda.</p>
        </div>
      </div>

      <div className="max-w-xl space-y-6">
        {/* User Card */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconUserCircle className="h-16 w-16 text-muted-foreground" />
              <div>
                <h2 className="text-xl font-bold">{userName || session?.user?.name || "Pengguna"}</h2>
                <p className="text-sm text-muted-foreground">{session?.user?.email || "—"}</p>
              </div>
            </div>
            <FormDialog
              title="Edit Profil"
              open={open}
              onOpenChange={setOpen}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <IconEdit className="h-4 w-4" /> Edit
                </Button>
              }
            >
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">Simpan Perubahan</Button>
              </form>
            </FormDialog>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <h3 className="text-lg font-semibold">Preferensi</h3>
        <Card>
          <CardContent className="p-0 divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <IconSun className="h-5 w-5 text-muted-foreground" />
                <span>Tema Aplikasi</span>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <IconSettings className="h-5 w-5 text-muted-foreground" />
                <span>Pengaturan Umum</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full" 
                aria-label="Buka Pengaturan Umum"
              >
                <IconChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mt-6">Akun</h3>
        <Card>
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-none bg-transparent rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-3 text-red-500">
                <IconLogout className="h-5 w-5" />
                <span className="text-sm font-semibold">Keluar</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
