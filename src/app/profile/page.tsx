"use client"

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconUserCircle, IconSettings, IconLogout, IconSun } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion } from "motion/react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function ProfilePage() {
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

      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
        <IconUserCircle className="h-16 w-16 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-bold">Nanas Gunung</h2>
          <CardDescription>nanas@example.com</CardDescription>
        </div>
      </div>

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
