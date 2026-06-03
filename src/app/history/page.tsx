"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDroplet, IconTool } from "@tabler/icons-react"
import { motion } from "motion/react"
import { api } from "@/lib/services/api"
import type { FuelLog, MaintenanceRecord } from "@/lib/types"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

function groupByMonth(items: Array<{ date: string } & Record<string, any>>) {
  const groups: Record<string, any[]> = {}
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`

  for (const item of items) {
    const month = item.date.substring(0, 7)
    if (month === currentMonth) {
      if (!groups["Bulan Ini"]) groups["Bulan Ini"] = []
      groups["Bulan Ini"].push(item)
    } else if (month === lastMonth) {
      if (!groups["Bulan Lalu"]) groups["Bulan Lalu"] = []
      groups["Bulan Lalu"].push(item)
    }
  }

  return groups
}

export default function HistoryPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [fuel, maint] = await Promise.all([
          api.getFuelLogs(),
          api.getMaintenanceRecords(),
        ])
        setFuelLogs(fuel)
        setMaintenance(maint)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const allItems = [
    ...fuelLogs.map((f) => ({ ...f, type: "fuel" as const })),
    ...maintenance.map((m) => ({ ...m, type: "maintenance" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const grouped = groupByMonth(allItems)
  const monthOrder = ["Bulan Ini", "Bulan Lalu"]
  const hasData = allItems.length > 0

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

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      ) : !hasData ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Belum ada riwayat.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {monthOrder.map((month) => {
            const items = grouped[month]
            if (!items) return null

            return (
              <Card key={month}>
                <CardHeader>
                  <CardTitle>{month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-full ${
                          item.type === "fuel" ? "bg-blue-500/10" : "bg-orange-500/10"
                        }`}>
                          {item.type === "fuel" ? (
                            <IconDroplet className="h-5 w-5 text-blue-500" />
                          ) : (
                            <IconTool className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">
                              {item.type === "fuel" ? `Isi Bensin (${item.fuelType})` : item.description}
                            </p>
                            <p className="font-medium text-sm">
                              {item.amount ? `Rp ${item.amount.toLocaleString()}` : ""}
                            </p>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <p>{item.type === "fuel" ? `${item.liters} Liter` : ""}</p>
                            <p>{item.date}</p>
                          </div>
                          {item.odoReading > 0 && (
                            <p className="text-xs text-muted-foreground">Odo: {item.odoReading.toLocaleString()} km</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
