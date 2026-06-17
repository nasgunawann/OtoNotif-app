"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconUserCircle, IconSettings, IconLogout, IconSun, IconEdit, IconChevronRight, IconLock, IconTrash, IconAlertTriangle } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion } from "motion/react"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { FormDialog } from "@/components/forms/FormDialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession, signOut, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
  const [imageInput, setImageInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (session?.user?.name) {
      setNameInput(session.user.name)
    } else if (userName) {
      setNameInput(userName)
    }
    if (session?.user?.image) {
      setImageInput(session.user.image)
    }
  }, [session, userName])
  /* eslint-enable react-hooks/set-state-in-effect */


  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Berhasil keluar")
      router.replace("/login")
    } catch {
      toast.error("Gagal keluar")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageInput(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) {
      toast.error("Nama tidak boleh kosong")
      return
    }
    setSaving(true)
    try {
      const { error } = await (authClient as unknown as {
        user: {
          update: (data: { name: string; image?: string }) => Promise<{ error?: { message?: string } }>;
        };
      }).user.update({
        name: nameInput.trim(),
        image: imageInput.trim() || "",
      })
      if (error) {
        toast.error(error.message || "Gagal memperbarui profil")
        return
      }
      setUserName(nameInput.trim())
      setOpen(false)
      toast.success("Profil berhasil diperbarui")
    } catch {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru harus minimal 8 karakter")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok")
      return
    }
    setPasswordSaving(true)
    try {
      const { error } = await (authClient as unknown as {
        changePassword: (data: Record<string, unknown>) => Promise<{ error?: { message?: string } }>;
      }).changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        toast.error(error.message || "Gagal memperbarui kata sandi")
        return
      }
      toast.success("Kata sandi berhasil diperbarui")
      setPasswordOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleting(true)
    try {
      const res = await fetch("/api/user/delete", { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Gagal menghapus akun")
        return
      }
      toast.success("Akun Anda berhasil dihapus secara permanen")
      await signOut()
      router.replace("/login")
    } catch {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="h-fit md:col-span-1">
          <CardContent className="p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 text-left md:text-center">
            <div className="flex flex-row md:flex-col items-center gap-4">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-16 w-16 md:h-24 md:w-24 rounded-full object-cover border"
                />
              ) : (
                <IconUserCircle className="h-16 w-16 md:h-24 md:w-24 text-muted-foreground" />
              )}
              <div>
                <h2 className="text-lg md:text-xl font-bold leading-tight">
                  {userName || session?.user?.name || "Pengguna"}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  {session?.user?.email || "—"}
                </p>
                {session?.user && (
                  <span className={cn(
                    "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border",
                    session.user.emailVerified
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {session.user.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}
                  </span>
                )}
              </div>
            </div>
            <FormDialog
              title="Edit Profil"
              open={open}
              onOpenChange={setOpen}
              trigger={
                <Button variant="outline" size="sm" className="gap-2 md:w-full">
                  <IconEdit className="h-4 w-4" /> Edit
                </Button>
              }
            >
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById("profile-upload")?.click()}>
                    {imageInput ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageInput}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover border-2 border-primary group-hover:opacity-85 transition-opacity"
                      />
                    ) : (
                      <IconUserCircle className="h-20 w-20 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-bold">Pilih Foto</span>
                    </div>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageInput && (
                    <Button
                      type="button"
                      variant="link"
                      className="text-xs text-red-500 h-auto p-0"
                      onClick={() => setImageInput("")}
                    >
                      Hapus Foto
                    </Button>
                  )}
                </div>
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
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </form>
            </FormDialog>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Keamanan</h3>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconLock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Kata Sandi</p>
                    <p className="text-xs text-muted-foreground">Perbarui kata sandi akun Anda secara berkala.</p>
                  </div>
                </div>
                <FormDialog
                  title="Ganti Kata Sandi"
                  open={passwordOpen}
                  onOpenChange={setPasswordOpen}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <IconLock className="h-4 w-4" /> Ubah
                    </Button>
                  }
                >
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Kata Sandi Sekarang</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Masukkan kata sandi saat ini"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi baru"
                        className="w-full"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={passwordSaving}>
                      {passwordSaving ? "Memproses..." : "Perbarui Kata Sandi"}
                    </Button>
                  </form>
                </FormDialog>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Akun</h3>
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

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-500">Zona Berbahaya</h3>
            <Card className="border-red-500/20 bg-red-500/[0.02] dark:bg-red-500/[0.01]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconAlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-red-500">Hapus Akun</p>
                    <p className="text-xs text-muted-foreground">Seluruh data Anda akan dihapus permanen.</p>
                  </div>
                </div>
                <FormDialog
                  title="Hapus Akun Permanen"
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  trigger={
                    <Button variant="destructive" size="sm" className="gap-2 bg-red-500 hover:bg-red-600 text-white border-none">
                      <IconTrash className="h-4 w-4" /> Hapus
                    </Button>
                  }
                >
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-xs">
                      <IconAlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Peringatan Penting</p>
                        <p className="mt-1">Tindakan ini tidak dapat dibatalkan. Seluruh data kendaraan, riwayat odometer, catatan BBM, dan pemantauan komponen Anda akan dihapus secara permanen dari server database Postgres.</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">Apakah Anda yakin ingin melanjutkan penghapusan akun?</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                        className="flex-1"
                        disabled={deleting}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        disabled={deleting}
                      >
                        {deleting ? "Menghapus..." : "Ya, Hapus Akun"}
                      </Button>
                    </div>
                  </form>
                </FormDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
