"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconAlertCircle, IconCircleCheck, IconTool } from "@tabler/icons-react"
import { motion } from "motion/react"
import { api } from "@/lib/services/api"
import type { VehicleHealth } from "@/lib/types"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function MaintenancePage() {
  const [healthData, setHealthData] = useState<VehicleHealth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const vehicles = await api.getVehicles()
        const health = await Promise.all(
          vehicles.map((v: any) => api.getVehicleHealth(v.id))
        )
        setHealthData(health)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const allComponents = healthData.flatMap((h) =>
    h.components.map((c) => ({ ...c, vehicleName: h.vehicle.name }))
  )
  const dueItems = allComponents.filter((c) => c.status === "danger" || c.status === "warning")
  const safeItems = allComponents.filter((c) => c.status === "safe")

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

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mt-8">Segera Lakukan</h2>
          {dueItems.length === 0 ? (
            <Card className="p-8 text-center border-green-500/20 bg-green-500/5">
              <IconCircleCheck className="h-10 w-10 mx-auto text-green-500 mb-3" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Semua komponen dalam kondisi baik.</p>
            </Card>
          ) : (
            dueItems.map((item) => (
              <Card
                key={`${item.component.id}`}
                className={cn(
                  "border-solid",
                  item.status === 'danger'
                    ? "border-orange-500/50 bg-orange-500/5 dark:bg-orange-500/10"
                    : "border-yellow-500/50 bg-yellow-500/5 dark:bg-yellow-500/10"
                )}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <IconAlertCircle
                    className={cn(
                      "h-5 w-5 mr-2",
                      item.status === 'danger' ? "text-orange-500" : "text-yellow-500"
                    )}
                  />
                  <CardTitle
                    className={cn(
                      "text-base font-bold",
                      item.status === 'danger'
                        ? "text-orange-700 dark:text-orange-400"
                        : "text-yellow-700 dark:text-yellow-400"
                    )}
                  >
                    Ganti {item.component.name} - {item.vehicleName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.status === "danger"
                      ? `Sudah melebihi batas interval ${item.component.intervalKm} km.`
                      : `Mendekati batas interval. Sisa ${item.remainingKm} km lagi.`}
                  </p>
                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-muted-foreground">Interval</span>
                    <span className="font-medium text-foreground">{item.component.intervalKm.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Terpakai</span>
                    <span className="font-medium text-foreground">{item.usedKm.toLocaleString()} km</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <h2 className="text-xl font-semibold mt-8">Aman (Dalam Batas Normal)</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {safeItems.length === 0 ? (
              <div className="col-span-2 text-center text-sm text-muted-foreground p-8">
                Belum ada komponen yang dipantau.
              </div>
            ) : (
              safeItems.map((item) => (
                <Card key={item.component.id}>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2 p-3">
                    <IconCircleCheck className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                    <CardTitle className="text-xs font-bold truncate">{item.component.name} - {item.vehicleName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-[10px] text-muted-foreground">Aman ({item.remainingKm.toLocaleString()} km lagi).</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
