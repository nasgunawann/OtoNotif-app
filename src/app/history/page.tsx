"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDroplet, IconTool, IconTrash, IconGauge, IconCoin, IconCar } from "@tabler/icons-react"
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
import Link from "next/link"

type HistoryItem = (
  | (FuelLog & { type: "fuel" })
  | (MaintenanceRecord & { type: "maintenance" })
  | (OdometerReading & { type: "odometer" })
)

const MONTH_NAMES: Record<string, string> = {
  "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
  "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
  "09": "September", "10": "Oktober", "11": "November", "12": "Desember",
}

const MONTH_ORDER = ["Bulan Ini", "Bulan Lalu"]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const day = d.getDate()
  const mon = MONTH_NAMES[String(d.getMonth() + 1).padStart(2, "0")] || ""
  const year = d.getFullYear()
  const now = new Date()
  const isThisYear = year === now.getFullYear()
  return `${day} ${mon}${isThisYear ? "" : ` ${year}`}`
}

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
  if (key === "Bulan Ini") return "Bulan Ini"
  if (key === "Bulan Lalu") return "Bulan Lalu"
  const [year, month] = key.split("-")
  return `${MONTH_NAMES[month] || month} ${year}`
}

function formatMonthTotalCost(items: HistoryItem[]): { fuel: number; maint: number } {
  let fuel = 0, maint = 0
  for (const item of items) {
    if (item.type === "fuel") fuel += item.amount ?? 0
    else if (item.type === "maintenance") maint += item.cost ?? 0
  }
  return { fuel, maint }
}

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

  const formatCurrency = (v: number) => {
    if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")} jt`
    if (v >= 1_000) return `Rp ${(v / 1_000).toLocaleString("id-ID")} rb`
    return `Rp ${v.toLocaleString("id-ID")}`
  }

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
        <Card className="p-12 text-center border-dashed">
          <IconGauge className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold mb-1">Belum Ada Riwayat</p>
          <p className="text-xs text-muted-foreground mb-4">
            Catat pengisian BBM, servis, atau update odometer untuk mulai melihat riwayat.
          </p>
          <div className="flex justify-center gap-2">
            <Button size="sm" className="text-xs font-bold gap-1 rounded-full" asChild>
              <Link href="/vehicles"><IconCar className="h-3.5 w-3.5" /> Pilih Kendaraan</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMonths.map((month) => {
            const items = groups[month]
            const costs = formatMonthTotalCost(items)
            const totalCost = costs.fuel + costs.maint
            return (
              <Card key={month}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{getMonthLabel(month)}</CardTitle>
                    {totalCost > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconCoin className="h-3.5 w-3.5" />
                        <span className="font-semibold text-foreground">{formatCurrency(totalCost)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{items.length} catatan</span>
                    {costs.fuel > 0 && <span>• BBM {formatCurrency(costs.fuel)}</span>}
                    {costs.maint > 0 && <span>• Servis {formatCurrency(costs.maint)}</span>}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
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

                      const title = isFuel ? item.fuelType : isMaint ? item.description : `${odoItem!.reading.toLocaleString("id-ID")} km`
                      const cost = isFuel ? `Rp ${item.amount.toLocaleString("id-ID")}` : isMaint && item.cost ? `Rp ${item.cost.toLocaleString("id-ID")}` : ""
                      const kml = isFuel ? (item as FuelLog & { type: "fuel" }).kmPerLiter : null
                      const subtitle = isFuel ? `${item.liters} L${kml ? ` • ${kml} km/L` : ""}` : ""

                      return (
                        <div key={item.id} className="flex gap-2.5 items-start">
                          <div className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-full ${iconBg} mt-0.5`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-xs truncate">{title}</span>
                              {delta > 0 && <span className="text-[8px] font-bold text-emerald-600">+{delta.toLocaleString("id-ID")}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                <span>{subtitle}</span>
                                {cost && <span className="font-medium">{cost}</span>}
                                <Badge variant="outline" className="text-[7px] py-0 px-1 h-3 rounded-full font-bold">{vehicleName}</Badge>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-muted-foreground">{formatDate(item.date)}</span>
                                <button type="button" className="text-muted-foreground/30 hover:text-red-500 transition-colors p-0.5"
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
                                  <IconTrash className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
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
