"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconAlertCircle, IconCircleCheck, IconTool, IconInfoCircle, IconCoin, IconPlus, IconChevronRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import { api } from "@/lib/services/api"
import type { Vehicle, VehicleHealth, ComponentHealth } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FormDialog } from "@/components/forms/FormDialog"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { ComponentForm } from "@/components/forms/ComponentForm"
import { ComponentDetailSheet } from "@/components/layout/ComponentDetailSheet"
import { SelectComponentsDialog } from "@/components/layout/SelectComponentsDialog"
import { COMPONENT_TEMPLATES } from "@/lib/component-templates"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")} jt`
  if (value >= 1_000) return `Rp ${(value / 1_000).toLocaleString("id-ID")} rb`
  return `Rp ${value.toLocaleString("id-ID")}`
}

export default function MaintenancePage() {
  const [healthData, setHealthData] = useState<VehicleHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [openSelectComponents, setOpenSelectComponents] = useState(false)
  const [detailComponent, setDetailComponent] = useState<{
    data: ComponentHealth
    vehicleId: string
    vehicleName: string
    vehicleType: "motor" | "mobil"
  } | null>(null)

  function loadData() {
    setLoading(true)
    api.getVehicles().then((vehicles) =>
      Promise.all(vehicles.map((v) => api.getVehicleHealth(v.id)))
    ).then((health) => {
      setHealthData(health)
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(loadData, [])

  const allComponents = useMemo(() =>
    healthData.flatMap((h) =>
      h.components.map((c) => ({
        ...c,
        vehicleId: h.vehicle.id,
        vehicleName: h.vehicle.name,
        vehicleType: h.vehicle.type as "motor" | "mobil",
        weeklyOdoDelta: h.weeklyOdoDelta ?? 0,
      }))
    ),
    [healthData]
  )

  const filtered = allComponents.filter(
    (c) => (selectedVehicleId === "all" || c.vehicleId === selectedVehicleId) &&
      (selectedFilter === "all" ||
        (selectedFilter === "due" && (c.status === "danger" || c.status === "warning")) ||
        (selectedFilter === "safe" && c.status === "safe"))
  )

  const dangerItems = filtered.filter((c) => c.status === "danger")
  const warningItems = filtered.filter((c) => c.status === "warning")
  const safeItems = filtered.filter((c) => c.status === "safe")

  const totalEstimate = useMemo(() => {
    let total = 0
    for (const item of [...dangerItems, ...warningItems]) {
      const templates = COMPONENT_TEMPLATES[item.vehicleType] || []
      const t = templates.find((tmpl) => tmpl.name === item.component.name)
      total += t?.estimatedCost ?? 0
    }
    return total
  }, [dangerItems, warningItems])

  function estimatedWeeks(remainingKm: number, weeklyDelta: number): string | null {
    if (weeklyDelta <= 0) return null
    const weeks = Math.ceil(remainingKm / weeklyDelta)
    if (weeks <= 0) return null
    if (weeks === 1) return "~1 minggu"
    if (weeks < 4) return `~${weeks} minggu`
    const months = Math.round(weeks / 4)
    return `~${months} bulan`
  }

  if (loading && healthData.length === 0) {
    return (
      <motion.div initial="initial" animate="animate" variants={fadeUp} className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
      </motion.div>
    )
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUp} className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold tracking-tight">Perawatan</h1>
          <p className="text-muted-foreground">Jadwal perawatan kendaraan Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-auto h-9 text-xs rounded-full bg-card/50 gap-1 px-3">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="due">Perlu Ganti</SelectItem>
              <SelectItem value="safe">Aman</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs rounded-full bg-card/50">
              <SelectValue placeholder="Semua Kendaraan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kendaraan</SelectItem>
              {healthData.map((h) => (
                <SelectItem key={h.vehicle.id} value={h.vehicle.id}>{h.vehicle.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cost Summary */}
      {(dangerItems.length > 0 || warningItems.length > 0) && (
        <Card className="border-none bg-card/50 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/10">
                <IconCoin className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold">Estimasi Biaya Mendatang</p>
                <p className="text-[10px] text-muted-foreground">
                  {dangerItems.length > 0 && `${dangerItems.length} perlu ganti segera`}
                  {dangerItems.length > 0 && warningItems.length > 0 && " • "}
                  {warningItems.length > 0 && `${warningItems.length} mendekati batas`}
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-orange-500">
              {formatCompactCurrency(totalEstimate)}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {allComponents.length === 0 && (
        <Card className="p-10 text-center border-dashed">
          <IconTool className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold mb-1">Belum Ada Komponen yang Dipantau</p>
          <p className="text-xs text-muted-foreground mb-4">Tambahkan komponen untuk mulai memantau jadwal perawatannya.</p>
          <div className="flex justify-center gap-2">
            <FormDialog title="Tambah Komponen"
              trigger={<Button size="sm" className="text-xs font-bold gap-1 rounded-full"><IconPlus className="h-3.5 w-3.5" /> Tambah Komponen</Button>}>
              <ComponentForm vehicleId="" onSuccess={() => { loadData() }} />
            </FormDialog>
            <Button size="sm" variant="outline" className="text-xs font-bold gap-1 rounded-full"
              onClick={() => setOpenSelectComponents(true)}>
              <IconPlus className="h-3.5 w-3.5" /> Komponen Umum
            </Button>
          </div>
        </Card>
      )}

      {/* Danger */}
      {dangerItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-bold">Perlu Ganti</h2>
            <Badge variant="outline" className="text-[10px] font-bold rounded-full ml-1">{dangerItems.length}</Badge>
          </div>
          {dangerItems.map((item) => {
            const templates = COMPONENT_TEMPLATES[item.vehicleType] || []
            const tmpl = templates.find((t) => t.name === item.component.name)
            return (
              <Card key={item.component.id} className="border-red-500/20 bg-red-500/[0.03] dark:bg-red-500/[0.05]">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconAlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="text-sm font-bold truncate">{item.component.name}</span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 rounded-full font-bold shrink-0">{item.vehicleName}</Badge>
                    </div>
                    <button type="button" className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
                      onClick={() => setDetailComponent({ data: item, vehicleId: item.vehicleId, vehicleName: item.vehicleName, vehicleType: item.vehicleType })}>
                      <IconChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                    <span>Interval {item.component.intervalKm.toLocaleString()} km</span>
                    <span>•</span>
                    <span>Terpakai {item.usedKm.toLocaleString()} km</span>
                    <span>•</span>
                    <span className="text-red-500 font-bold">Lebih {Math.abs(item.remainingKm).toLocaleString()} km</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${item.usagePercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {tmpl?.estimatedCost && (
                        <span className="text-[10px] font-bold text-muted-foreground">{formatCompactCurrency(tmpl.estimatedCost)}</span>
                      )}
                    </div>
                    <FormDialog title="Tambah Servis" description={`Servis ${item.component.name} untuk ${item.vehicleName}`}
                      trigger={<Button size="sm" className="h-7 text-[10px] font-bold gap-1 rounded-full"><IconTool className="h-3 w-3" /> Servis</Button>}>
                      <ServiceForm vehicleId={item.vehicleId} vehicleName={item.vehicleName}
                        defaultComponentId={item.component.id}
                        onSuccess={() => { loadData() }} />
                    </FormDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Warning */}
      {warningItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <h2 className="text-lg font-bold">Segera Cek</h2>
            <Badge variant="outline" className="text-[10px] font-bold rounded-full ml-1">{warningItems.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warningItems.map((item) => {
              const templates = COMPONENT_TEMPLATES[item.vehicleType] || []
              const tmpl = templates.find((t) => t.name === item.component.name)
              const weeks = estimatedWeeks(item.remainingKm, item.weeklyOdoDelta)
              return (
                <Card key={item.component.id} className="border-orange-500/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold truncate">{item.component.name}</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 rounded-full font-bold shrink-0">{item.vehicleName}</Badge>
                      </div>
                      <button type="button" className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
                        onClick={() => setDetailComponent({ data: item, vehicleId: item.vehicleId, vehicleName: item.vehicleName, vehicleType: item.vehicleType })}>
                        <IconInfoCircle className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">
                      Sisa <span className="font-semibold text-orange-500">{item.remainingKm.toLocaleString()} km</span>
                      {weeks && <> ({weeks})</>}
                    </p>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${item.usagePercent}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {tmpl?.estimatedCost ? formatCompactCurrency(tmpl.estimatedCost) : ""}
                      </span>
                      <FormDialog title="Tambah Servis" description={`Servis ${item.component.name}`}
                        trigger={<Button size="sm" className="h-6 text-[9px] font-bold gap-1 rounded-full"><IconTool className="h-3 w-3" /> Servis</Button>}>
                        <ServiceForm vehicleId={item.vehicleId} vehicleName={item.vehicleName}
                          defaultComponentId={item.component.id}
                          onSuccess={() => { loadData() }} />
                      </FormDialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Safe */}
      {safeItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <h2 className="text-lg font-bold">Aman</h2>
            <Badge variant="outline" className="text-[10px] font-bold rounded-full ml-1">{safeItems.length}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {safeItems.map((item) => (
              <Card key={item.component.id}>
                <CardContent className="p-2.5 flex items-center gap-2">
                  <IconCircleCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold truncate">{item.component.name}</p>
                    <p className="text-[8px] text-muted-foreground">{item.remainingKm.toLocaleString()} km lagi</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <SelectComponentsDialog vehicle={
        selectedVehicleId !== "all"
          ? healthData.find(h => h.vehicle.id === selectedVehicleId)?.vehicle ?? healthData[0]?.vehicle
          : healthData[0]?.vehicle
        }
        open={openSelectComponents}
        onOpenChange={setOpenSelectComponents}
        onSuccess={loadData}
      />

      {detailComponent && (
        <ComponentDetailSheet
          data={detailComponent.data}
          vehicleId={detailComponent.vehicleId}
          vehicleName={detailComponent.vehicleName}
          vehicleType={detailComponent.vehicleType}
          open={!!detailComponent}
          onOpenChange={(open) => { if (!open) setDetailComponent(null) }}
          onDeleted={loadData}
        />
      )}
    </motion.div>
  )
}
