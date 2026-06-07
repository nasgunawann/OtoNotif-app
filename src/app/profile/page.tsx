"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconUserCircle, IconSettings, IconLogout, IconSun, IconEdit } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion } from "motion/react"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { FormDialog } from "@/components/forms/FormDialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function ProfilePage() {
  const { userName, setUserName } = useVehicleStore()
  const [open, setOpen] = useState(false)
  const [nameInput, setNameInput] = useState(userName)

  useEffect(() => {
    setNameInput(userName)
  }, [userName])

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
      className="space-y-6"
    >
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">Pengaturan akun dan preferensi Anda.</p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <IconUserCircle className="h-16 w-16 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-bold">{userName}</h2>
              <CardDescription>nanas@example.com</CardDescription>
            </div>
          </div>
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            title="Edit Profil"
            description="Perbarui nama profil Anda di aplikasi OtoNotif."
            trigger={
              <Button variant="outline" size="sm" className="gap-1 rounded-full">
                <IconEdit className="h-4 w-4" /> Edit
              </Button>
            }
          >
            <form onSubmit={handleSave} className="space-y-4 py-4 md:py-0">
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
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  Simpan
                </Button>
              </div>
            </form>
          </FormDialog>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold mt-6">Preferensi</h3>
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
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
              <Button variant="ghost" size="sm">›</Button>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mt-6">Akun</h3>
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 text-red-500">
                <IconLogout className="h-5 w-5" />
                <span>Keluar</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
