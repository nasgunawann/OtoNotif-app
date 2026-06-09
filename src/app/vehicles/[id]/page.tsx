"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  IconChevronLeft,
  IconSettings,
  IconGauge,
  IconCar,
  IconMotorbike,
  IconDroplet,
  IconTool,
  IconPlus,
  IconArrowRight,
  IconTrash,
  IconReceipt,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { FormDialog } from "@/components/forms/FormDialog"
import { OdometerForm } from "@/components/forms/OdometerForm"
import { FuelForm } from "@/components/forms/FuelForm"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { VehicleForm } from "@/components/forms/VehicleForm"
import { ComponentForm } from "@/components/forms/ComponentForm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Link from "next/link"
import { COMPONENT_TEMPLATES, type ComponentTemplate } from "@/lib/component-templates"
import { ComponentDetailSheet } from "@/components/layout/ComponentDetailSheet"
import { SelectComponentsDialog } from "@/components/layout/SelectComponentsDialog"
import type { ComponentHealth } from "@/lib/types"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const {
    selectedVehicle,
    vehicleHealth,
    odometerReadings,
    fetchVehicle,
    fetchVehicleHealth,
    fetchComponents,
    fetchOdometerReadings,
    deleteOdometerReading,
    deleteVehicle,
    updateVehicle,
    loading
  } = useVehicleStore()

  const [openOdometer, setOpenOdometer] = useState(false)
  const [openFuel, setOpenFuel] = useState(false)
  const [openService, setOpenService] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openComponent, setOpenComponent] = useState(false)
  const [openSelectComponents, setOpenSelectComponents] = useState(false)
  const [detailComponent, setDetailComponent] = useState<ComponentHealth | null>(null)

  useEffect(() => {
    if (id) {
      fetchVehicle(id)
      fetchVehicleHealth(id)
      fetchComponents(id)
      fetchOdometerReadings(id)
    }
  }, [id, fetchVehicle, fetchVehicleHealth, fetchComponents, fetchOdometerReadings])

  function refresh() {
    if (id) {
      fetchVehicleHealth(id)
      fetchComponents(id)
      fetchOdometerReadings(id)
    }
  }

  async function handleDelete() {
    if (confirm("Apakah Anda yakin ingin menghapus kendaraan ini beserta seluruh catatannya? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await deleteVehicle(id)
        toast.success("Kendaraan berhasil dihapus")
        router.push("/vehicles")
      } catch {
        toast.error("Gagal menghapus kendaraan")
      }
    }
  }

  if (loading && !selectedVehicle) {
    return (
      <div className="space-y-6 pb-24 md:pb-6 animate-pulse">
        <div className="h-40 md:h-60 rounded-xl bg-muted" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  if (!selectedVehicle) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Kendaraan tidak ditemukan.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">Kembali</Button>
      </div>
    )
  }

  const vehicle = selectedVehicle
  const healthData = vehicleHealth
  const summary = healthData?.componentSummary
  const templates = COMPONENT_TEMPLATES[vehicle.type]
  const upcomingCost = healthData?.components
    ?.filter(c => c.status !== "safe")
    .reduce((sum, c) => {
      const t = templates.find(tmpl => tmpl.name === c.component.name)
      return sum + (t?.estimatedCost ?? 0)
    }, 0) ?? 0

  const formatCompactCurrency = (value: number) => {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")} jt`
    if (value >= 1_000) return `Rp ${(value / 1_000).toLocaleString("id-ID")} rb`
    return `Rp ${value.toLocaleString("id-ID")}`
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-4 pb-24 md:pb-6"
    >
      {/* === HEADER + COMPACT INFO BAR === */}
      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
            <IconChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold truncate">{vehicle.name}</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">
              {vehicle.type === "motor" ? <IconMotorbike className="h-3 w-3 inline mr-0.5" /> : <IconCar className="h-3 w-3 inline mr-0.5" />}
              {vehicle.engine || vehicle.type} • {vehicle.fuelCapacity}L
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <FormDialog
            title="Update Odometer"
            description={vehicle.name}
            trigger={
              <Button size="sm" className="h-8 text-xs font-bold gap-1 rounded-full hidden md:flex">
                <IconGauge className="h-3.5 w-3.5" />
                Update Odo
              </Button>
            }
            open={openOdometer}
            onOpenChange={setOpenOdometer}
          >
            <OdometerForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenOdometer(false); refresh() }} />
          </FormDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconSettings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>Edit Kendaraan</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleDelete}>Hapus Kendaraan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* === MAIN LAYOUT: 2-COLUMN DESKTOP === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* ===== LEFT COLUMN (lg:col-span-2) ===== */}
        <div className="lg:col-span-2 space-y-4">

          {/* Mobile Quick Actions */}
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            <FormDialog title="Update Odometer" description={vehicle.name} open={openOdometer} onOpenChange={setOpenOdometer}
              trigger={<Button className="h-10 text-[10px] font-bold gap-1" variant="outline"><IconGauge className="h-3.5 w-3.5" /> Odometer</Button>}>
              <OdometerForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenOdometer(false); refresh() }} />
            </FormDialog>
            <FormDialog title="Isi Bensin" description={vehicle.name} open={openFuel} onOpenChange={setOpenFuel}
              trigger={<Button className="h-10 text-[10px] font-bold gap-1" variant="outline"><IconDroplet className="h-3.5 w-3.5 text-blue-500" /> Bensin</Button>}>
              <FuelForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenFuel(false); refresh() }} />
            </FormDialog>
            <FormDialog title="Tambah Servis" description={vehicle.name} open={openService} onOpenChange={setOpenService}
              trigger={<Button className="h-10 text-[10px] font-bold gap-1" variant="outline"><IconTool className="h-3.5 w-3.5" /> Servis</Button>}>
              <ServiceForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenService(false); refresh() }} />
            </FormDialog>
          </div>

          {/* Status Komponen */}
          <Card className="border-none bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-base flex justify-between items-center">
                Komponen
                <div className="flex gap-2 items-center">
                  <FormDialog title="Tambah Komponen" open={openComponent} onOpenChange={setOpenComponent}
                    trigger={<Button variant="link" className="h-auto p-0 text-xs text-primary font-bold">Tambah</Button>}>
                    <ComponentForm vehicleId={id} vehicleType={vehicle.type} onSuccess={() => { setOpenComponent(false); fetchComponents(id); fetchVehicleHealth(id) }} />
                  </FormDialog>
                  <span className="text-muted-foreground/30 text-xs">•</span>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary font-bold" onClick={async () => {
                    await fetchVehicleHealth(id)
                    setOpenSelectComponents(true)
                  }}>
                    Umum
                  </Button>
                  <span className="text-muted-foreground/30 text-xs">•</span>
                  <Button variant="link" className="h-auto p-0 text-xs font-normal" asChild>
                    <Link href="/maintenance">Lihat Semua</Link>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {healthData?.components.map((item) => {
                const { component, remainingKm, status } = item
                return (
                  <div key={component.id} className="flex items-center justify-between rounded-lg hover:bg-muted/30 transition-colors group">
                    <button type="button" className="flex items-center gap-2.5 flex-1 min-w-0 py-2 px-2 text-left"
                      onClick={() => setDetailComponent(item)}>
                      <div className={`p-1.5 rounded-full shrink-0 ${status === 'danger' ? 'bg-red-500/10' : status === 'warning' ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
                        <IconTool className={`h-3.5 w-3.5 ${status === 'danger' ? 'text-red-500' : status === 'warning' ? 'text-orange-500' : 'text-green-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-semibold truncate">{component.name}</p>
                        <p className="text-[9px] md:text-[10px] text-muted-foreground">
                          {status === "danger" ? `Perlu ganti (${remainingKm} km)` : status === "warning" ? `Sisa ${remainingKm} km` : "Kondisi Baik"}
                        </p>
                      </div>
                    </button>
                    <button type="button" className="p-1.5 shrink-0 text-muted-foreground/30 hover:text-foreground transition-colors"
                      onClick={() => setDetailComponent(item)} aria-label="Detail komponen">
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
              {(!healthData?.components || healthData.components.length === 0) && (
                <div className="text-center py-6 space-y-3">
                  <div className="flex justify-center gap-3 text-muted-foreground/30">
                    <IconTool className="h-6 w-6" />
                    <IconGauge className="h-6 w-6" />
                    <IconCar className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-muted-foreground">Belum ada komponen yang dipantau</p>
                  <p className="text-[10px] text-muted-foreground/60">Pantau kondisi oli, ban, kampas rem, dan lainnya</p>
                  <div className="flex justify-center gap-2 pt-1">
                    <FormDialog title="Tambah Komponen" open={openComponent} onOpenChange={setOpenComponent}
                      trigger={<Button size="sm" className="text-xs font-bold gap-1 rounded-full"><IconPlus className="h-3.5 w-3.5" /> Tambah</Button>}>
                      <ComponentForm vehicleId={id} vehicleType={vehicle.type} onSuccess={() => { setOpenComponent(false); fetchComponents(id); fetchVehicleHealth(id) }} />
                    </FormDialog>
                    <Button size="sm" variant="outline" className="text-xs font-bold gap-1 rounded-full"
                      onClick={async () => { await fetchVehicleHealth(id); setOpenSelectComponents(true) }}>
                      <IconPlus className="h-3.5 w-3.5" /> Komponen Umum
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Riwayat Odometer (compact) */}
          <Card className="border-none bg-card/50">
            <CardHeader className="pb-2 px-3 md:px-4">
              <CardTitle className="text-xs md:text-sm font-bold">Riwayat Odometer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 md:px-4">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {odometerReadings.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">Belum ada catatan.</p>
                ) : (
                  odometerReadings.slice(0, 5).map((odo) => (
                    <div key={odo.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <IconGauge className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                        <span className="text-xs font-semibold">{odo.reading.toLocaleString("id-ID")} km</span>
                        <span className="text-[9px] text-muted-foreground truncate">{odo.date}</span>
                      </div>
                      <button type="button" className="text-muted-foreground/30 hover:text-red-500 transition-colors p-0.5"
                        onClick={async () => {
                          if (confirm("Hapus?")) {
                            try { await deleteOdometerReading(odo.id, vehicle.id); toast.success("Dihapus") }
                            catch { toast.error("Gagal") }
                          }
                        }}>
                        <IconTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
                {odometerReadings.length > 5 && (
                  <p className="text-[9px] text-muted-foreground text-center py-1">+{odometerReadings.length - 5} lagi</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile: Bayar Pajak + Biaya */}
          <div className="lg:hidden space-y-3">
            <Button className="w-full h-10 text-xs font-bold gap-1" variant="outline"
              onClick={async () => {
                if (!vehicle.taxDueDate) { toast.error("Atur tanggal pajak dulu"); return }
                try {
                  const due = new Date(vehicle.taxDueDate); const nextDue = new Date(due); nextDue.setFullYear(nextDue.getFullYear() + 1)
                  await updateVehicle(vehicle.id, { lastTaxPaidDate: new Date().toISOString().split("T")[0], taxDueDate: nextDue.toISOString().split("T")[0] })
                  toast.success("Pajak dicatat"); refresh()
                } catch { toast.error("Gagal") }
              }}>
              <IconReceipt className="h-3.5 w-3.5" /> Bayar Pajak
            </Button>
            <Card className="border-none bg-card/50">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Biaya Bulan Ini</p>
                  <p className="text-sm font-bold">{healthData?.monthlyCost ? formatCompactCurrency(healthData.monthlyCost) : "Rp 0"}</p>
                </div>
                {upcomingCost > 0 && (
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground">Estimasi kritis</p>
                    <p className="text-xs font-bold text-orange-500">{formatCompactCurrency(upcomingCost)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (lg:col-span-1) ===== */}
        <div className="flex flex-col gap-4">

          {/* Info Kendaraan (visible on all screens, top of sidebar on desktop) */}
          <Card className="border-none bg-card/50 relative overflow-hidden">
            {vehicle.image && (
              <div className="absolute inset-0 pointer-events-none select-none">
                <Image src={vehicle.image} alt="" fill className="object-cover object-right opacity-10 dark:opacity-15 grayscale contrast-125" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              </div>
            )}
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Info Kendaraan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-[10px] relative z-10">
              {/* Odometer */}
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <IconGauge className="h-4 w-4 text-primary" />
                {healthData?.latestOdo ? `${healthData.latestOdo.toLocaleString()} km` : "—"}
              </div>
              {/* Component Summary Badges */}
              {summary && summary.total > 0 && (
                <div className="flex items-center gap-1.5 text-[9px] font-bold flex-wrap">
                  {summary.danger > 0 && <span className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md">{summary.danger} Kritis</span>}
                  {summary.warning > 0 && <span className="bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded-md">{summary.warning} Periksa</span>}
                  {summary.safe > 0 && <span className="bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-md">{summary.safe} Aman</span>}
                </div>
              )}
              <div className="border-t border-border/40 pt-2 space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Tipe</span><span className="font-semibold capitalize">{vehicle.type}</span></div>
                {vehicle.engine && <div className="flex justify-between"><span className="text-muted-foreground">Mesin</span><span className="font-semibold">{vehicle.engine}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Kapasitas BBM</span><span className="font-semibold">{vehicle.fuelCapacity}L</span></div>
                {vehicle.taxDueDate && <div className="flex justify-between"><span className="text-muted-foreground">Pajak</span>
                  <span className={cn("font-semibold", healthData?.taxStatus?.status === "danger" ? "text-red-500" : healthData?.taxStatus?.status === "warning" ? "text-orange-500" : "text-green-500")}>
                    {healthData?.taxStatus?.status === "danger" ? "Overdue" : healthData?.taxStatus?.status === "warning" ? `H-${healthData.taxStatus.daysRemaining}` : "Lunas"}
                    {vehicle.taxAmount > 0 && ` • ${formatCompactCurrency(vehicle.taxAmount)}`}
                  </span>
                </div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Terdaftar</span><span className="font-semibold">{vehicle.createdAt?.split("T")[0]}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (desktop only) */}
          <div className="hidden lg:block">
            <Card className="border-none bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormDialog title="Isi Bensin" description={vehicle.name} open={openFuel} onOpenChange={setOpenFuel}
                  trigger={<Button className="w-full h-10 text-xs font-bold gap-2 justify-start" variant="outline"><IconDroplet className="h-4 w-4 text-blue-500" /> Isi Bensin</Button>}>
                  <FuelForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenFuel(false); refresh() }} />
                </FormDialog>
                <FormDialog title="Tambah Servis" description={vehicle.name} open={openService} onOpenChange={setOpenService}
                  trigger={<Button className="w-full h-10 text-xs font-bold gap-2 justify-start" variant="outline"><IconTool className="h-4 w-4" /> Servis Baru</Button>}>
                  <ServiceForm vehicleId={vehicle.id} vehicleName={vehicle.name} onSuccess={() => { setOpenService(false); refresh() }} />
                </FormDialog>
                <Button className="w-full h-10 text-xs font-bold gap-2 justify-start" variant="outline"
                  onClick={async () => {
                    if (!vehicle.taxDueDate) { toast.error("Atur tanggal pajak dulu"); return }
                    try {
                      const due = new Date(vehicle.taxDueDate); const nextDue = new Date(due); nextDue.setFullYear(nextDue.getFullYear() + 1)
                      await updateVehicle(vehicle.id, { lastTaxPaidDate: new Date().toISOString().split("T")[0], taxDueDate: nextDue.toISOString().split("T")[0] })
                      toast.success("Pajak dicatat"); refresh()
                    } catch { toast.error("Gagal") }
                  }}>
                  <IconReceipt className="h-4 w-4" /> Bayar Pajak
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Biaya & Proyeksi (desktop only) */}
          <div className="hidden lg:block">
            <Card className="border-none bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Biaya & Proyeksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Bulan ini</span>
                  <span className="text-sm font-bold">{healthData?.monthlyCost ? formatCompactCurrency(healthData.monthlyCost) : "Rp 0"}</span>
                </div>
                {upcomingCost > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground">Estimasi komponen kritis</span>
                    <span className="text-sm font-bold text-orange-500">{formatCompactCurrency(upcomingCost)}</span>
                  </div>
                )}
                {summary && summary.total > 0 && (summary.danger > 0 || summary.warning > 0) && (
                  <div className="pt-2 border-t border-border/40">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1.5 tracking-wider">Akan Datang</p>
                    {healthData?.components.filter(c => c.status !== "safe").slice(0, 3).map(c => (
                      <div key={c.component.id} className="flex items-center justify-between py-1">
                        <span className="text-[10px] truncate">{c.component.name}</span>
                        <span className={cn(
                          "text-[9px] font-bold",
                          c.status === "danger" ? "text-red-500" : "text-orange-500",
                        )}>Sisa {c.remainingKm} km</span>
                      </div>
                    ))}
                  </div>
                )}
                {(healthData?.monthlyCost ?? 0) > 0 && (healthData?.latestOdo ?? 0) > 0 && (
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground">per km</span>
                    <span className="text-[10px] font-bold">
                      Rp {Math.round((healthData?.monthlyCost ?? 0) / Math.max(1, healthData?.latestOdo ?? 1)).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* === DIALOGS (shared) === */}
      <FormDialog title="Edit Kendaraan" description={vehicle.name} open={openEdit} onOpenChange={setOpenEdit}>
        <VehicleForm vehicle={vehicle} onSuccess={() => { setOpenEdit(false); refresh() }} />
      </FormDialog>

      <SelectComponentsDialog vehicle={vehicle} open={openSelectComponents} onOpenChange={setOpenSelectComponents} onSuccess={refresh} />

      {detailComponent && (
        <ComponentDetailSheet
          data={detailComponent}
          vehicleId={id}
          vehicleName={vehicle.name}
          vehicleType={vehicle.type}
          open={!!detailComponent}
          onOpenChange={(open) => { if (!open) setDetailComponent(null) }}
          onDeleted={refresh}
        />
      )}
    </motion.div>
  )
}
