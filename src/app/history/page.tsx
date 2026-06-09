"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDroplet, IconTool, IconTrash, IconGauge } from "@tabler/icons-react"
import { motion } from "motion/react"
import { api } from "@/lib/services/api"
import type { FuelLog, MaintenanceRecord, OdometerReading } from "@/lib/types"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

type HistoryItem = (
  | (FuelLog & { type: "fuel" })
  | (MaintenanceRecord & { type: "maintenance" })
  | (OdometerReading & { type: "odometer" })
)

function getMonthKey(dateStr: string): string {
  const now = new Date()
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}`
  const itemMonth = dateStr.substring(0, 7)
  if (itemMonth === current) return "Bulan Ini"
  if (itemMonth === lastMonth) return "Bulan Lalu"
  return itemMonth
}

function getMonthLabel(key: string): string {
  const names: Record<string, string> = {
    "Bulan Ini": "Bulan Ini",
    "Bulan Lalu": "Bulan Lalu",
  }
  return names[key] || key
}

const MONTH_ORDER = ["Bulan Ini", "Bulan Lalu"]

function monthSortKey(a: string, b: string): number {
  const ai = MONTH_ORDER.indexOf(a)
  const bi = MONTH_ORDER.indexOf(b)
  if (ai !== -1 && bi !== -1) return ai - bi
  if (ai !== -1) return -1
  if (bi !== -1) return 1
  return b.localeCompare(a)
}

function computeOdoDeltas(readings: OdometerReading[]): Map<string, number> {
  const sorted = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const deltas = new Map<string, number>()
  for (let i = 1; i < sorted.length; i++) {
    const delta = sorted[i].reading - sorted[i - 1].reading
    if (delta > 0) deltas.set(sorted[i].id, delta)
  }
  return deltas
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

const typeFilters = [
  { value: "all", label: "Semua Tipe" },
  { value: "fuel", label: "BBM" },
  { value: "maintenance", label: "Perawatan" },
  { value: "odometer", label: "Odometer" },
]

export default function HistoryPage() {
  const { vehicles, fetchVehicles } = useVehicleStore()
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([])
  const [odometerReadings, setOdometerReadings] = useState<OdometerReading[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all")
  const [selectedLogType, setSelectedLogType] = useState<string>("all")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        await fetchVehicles()
        const [fuel, maint] = await Promise.all([
          api.getFuelLogs(),
          api.getMaintenanceRecords(),
        ])
        setFuelLogs(fuel)
        setMaintenance(maint)

        const v = vehicles.length > 0 ? vehicles : await api.getVehicles()
        const odoPromises = v.map((v) => api.getOdometerReadings(v.id))
        const odoResults = await Promise.all(odoPromises)
        setOdometerReadings(odoResults.flat())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fetchVehicles])

  const odoDeltas = useMemo(() => computeOdoDeltas(odometerReadings), [odometerReadings])

  const allItems: HistoryItem[] = [
    ...fuelLogs.map((f) => ({ ...f, type: "fuel" as const })),
    ...maintenance.map((m) => ({ ...m, type: "maintenance" as const })),
    ...odometerReadings.map((o) => ({ ...o, type: "odometer" as const })),
  ]
    .filter((item) => selectedVehicleId === "all" || item.vehicleId === selectedVehicleId)
    .filter((item) => {
      if (selectedLogType === "all") return true
      return item.type === selectedLogType
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const groups: Record<string, HistoryItem[]> = {}
  for (const item of allItems) {
    const key = getMonthKey(item.date)
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  const sortedMonths = Object.keys(groups).sort(monthSortKey)
  const hasData = allItems.length > 0

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUp} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold tracking-tight">Riwayat</h1>
          <p className="text-muted-foreground">Semua aktivitas kendaraan Anda.</p>
        </div>
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="flex-1 sm:w-[180px] h-10 rounded-full bg-card/50">
              <SelectValue placeholder="Semua Kendaraan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kendaraan</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLogType} onValueChange={setSelectedLogType}>
            <SelectTrigger className="flex-1 sm:w-[150px] h-10 rounded-full bg-card/50">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              {typeFilters.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (<div key={i} className="h-48 bg-muted rounded-xl" />))}
        </div>
      ) : !hasData ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Belum ada riwayat.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMonths.map((month) => {
            const items = groups[month]
            return (
              <Card key={month}>
                <CardHeader><CardTitle>{getMonthLabel(month)}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {items.map((item) => {
                      const vehicle = vehicles.find((v) => v.id === item.vehicleId)
                      const vehicleName = vehicle ? vehicle.name : "Kendaraan"
                      const isOdo = item.type === "odometer"
                      const isFuel = item.type === "fuel"
                      const isMaint = item.type === "maintenance"

                      const iconBg = isFuel ? "bg-blue-500/10" : isMaint ? "bg-orange-500/10" : "bg-amber-500/10"
                      const iconColor = isFuel ? "text-blue-500" : isMaint ? "text-orange-500" : "text-amber-600"
                      const Icon = isFuel ? IconDroplet : isMaint ? IconTool : IconGauge
                      const odoItem = isOdo ? (item as OdometerReading & { type: "odometer" }) : null
                      const delta = odoItem ? odoDeltas.get(odoItem.id) || 0 : 0

                      const title = isFuel ? `Isi Bensin (${item.fuelType})` : isMaint ? item.description : `${odoItem!.reading.toLocaleString("id-ID")} km`
                      const cost = isFuel ? `Rp ${item.amount.toLocaleString("id-ID")}` : isMaint && item.cost ? `Rp ${item.cost.toLocaleString("id-ID")}` : ""
                      const subtitle = isFuel ? `${item.liters} L` : ""

                      return (
                        <div key={item.id} className="flex gap-3 items-center group">
                          <div className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full ${iconBg}`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-sm truncate">{title}</span>
                              {delta > 0 && <span className="text-[9px] font-bold text-emerald-600">+{delta.toLocaleString("id-ID")} km</span>}
                              <Badge variant="outline" className="text-[8px] py-0 px-1 h-3.5 rounded-full font-bold">{vehicleName}</Badge>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                              <span>{subtitle}</span>
                              <div className="flex items-center gap-2">
                                {cost && <span className="font-medium">{cost}</span>}
                                <span>{item.date}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={async () => {
                              if (confirm(`Hapus catatan ini?`)) {
                                try {
                                  if (isFuel) { await api.deleteFuelLog(item.id); setFuelLogs(p => p.filter(x => x.id !== item.id)) }
                                  else if (isMaint) { await api.deleteMaintenanceRecord(item.id); setMaintenance(p => p.filter(x => x.id !== item.id)) }
                                  else { await api.deleteOdometerReading(item.id); setOdometerReadings(p => p.filter(x => x.id !== item.id)) }
                                  toast.success("Catatan berhasil dihapus")
                                } catch { toast.error("Gagal menghapus") }
                              }
                            }}>
                            <IconTrash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )
                    })}
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
