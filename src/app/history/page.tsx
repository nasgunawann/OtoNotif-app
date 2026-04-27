"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDroplet, IconTool } from "@tabler/icons-react"
import { motion } from "motion/react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function HistoryPage() {
  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6"
    >
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">Riwayat</h1>
        <p className="text-muted-foreground">Log pengisian BBM dan servis kendaraan Anda.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-500/10 h-10 w-10 shrink-0 flex items-center justify-center rounded-full">
                  <IconDroplet className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Isi Bensin (Pertamax)</p>
                    <p className="font-medium">Rp 300.000</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>Civic Turbo • 25 Liter</p>
                    <p>2 hari yang lalu</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Odo: 45.200 km</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-orange-500/10 h-10 w-10 shrink-0 flex items-center justify-center rounded-full">
                  <IconTool className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Ganti V-Belt</p>
                    <p className="font-medium">Rp 150.000</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>Supra Bapak</p>
                    <p>1 minggu yang lalu</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Odo: 12.300 km</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulan Lalu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-500/10 h-10 w-10 shrink-0 flex items-center justify-center rounded-full">
                  <IconDroplet className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Isi Bensin (Pertalite)</p>
                    <p className="font-medium">Rp 35.000</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>Supra Bapak • 3.5 Liter</p>
                    <p>3 minggu yang lalu</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Odo: 12.100 km</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
