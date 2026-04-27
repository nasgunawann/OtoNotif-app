"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"
import { motion } from "motion/react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function MaintenancePage() {
  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6"
    >
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">Perawatan</h1>
        <p className="text-muted-foreground">Jadwal perawatan kendaraan Anda.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mt-8">Segera Lakukan</h2>
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <IconAlertCircle className="h-5 w-5 text-orange-500 mr-2" />
            <CardTitle className="text-base font-bold text-orange-700 dark:text-orange-400">Ganti Oli Mesin - Supra Bapak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sudah mendekati batas interval (Tersisa 200 km).</p>
            <div className="flex justify-between text-sm mt-4">
              <span className="text-muted-foreground">Interval</span>
              <span className="font-medium text-foreground">2.000 km</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Odo Terakhir Servis</span>
              <span className="font-medium text-foreground">10.500 km</span>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mt-8">Aman (Dalam Batas Normal)</h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 p-3">
              <IconCircleCheck className="h-4 w-4 text-green-500 mr-2 shrink-0" />
              <CardTitle className="text-xs font-bold truncate">Ganti Oli - Civic</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-[10px] text-muted-foreground">Aman (4.8k km lagi).</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 p-3">
              <IconCircleCheck className="h-4 w-4 text-green-500 mr-2 shrink-0" />
              <CardTitle className="text-xs font-bold truncate">Filter - Supra</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-[10px] text-muted-foreground">Aman (3.5k km lagi).</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
