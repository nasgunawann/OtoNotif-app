"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  IconChevronLeft,
  IconSettings,
  IconGauge,
  IconCar,
  IconDroplet,
  IconTool,
  IconActivity,
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-24 md:pb-6"
    >
      <div className="hidden md:flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <IconChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold">Detail Kendaraan</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconSettings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              Edit Kendaraan
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={handleDelete}
            >
              Hapus Kendaraan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative h-40 md:h-60 w-full rounded-xl overflow-hidden bg-muted shadow-inner">
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur hover:bg-background shadow-md">
                <IconSettings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit Kendaraan
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={handleDelete}
              >
                Hapus Kendaraan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-muted-foreground/20">
            {vehicle.type === "motor" ? <IconActivity className="h-24 w-24" /> : <IconCar className="h-24 w-24" />}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
          <h2 className="text-2xl font-bold text-white">{vehicle.name}</h2>
          <p className="text-white/80 text-sm font-medium">{vehicle.engine} • {vehicle.fuelCapacity}L</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-card/50">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <IconGauge className="h-5 w-5 text-primary mb-2" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Odometer</p>
            <p className="font-bold">{healthData?.latestOdo ? `${healthData.latestOdo.toLocaleString()} km` : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/50">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <IconActivity className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Kesehatan</p>
            <p className="font-bold text-green-500">{healthData?.health ?? "—"}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            Status Komponen
            <div className="flex gap-2 items-center">
              <FormDialog
                title="Tambah Komponen"
                open={openComponent}
                onOpenChange={setOpenComponent}
                trigger={
                  <Button variant="link" className="h-auto p-0 text-xs text-primary font-bold">
                    Tambah
                  </Button>
                }
              >
                <ComponentForm
                  vehicleId={id}
                  onSuccess={() => {
                    setOpenComponent(false)
                    fetchComponents(id)
                    fetchVehicleHealth(id)
                  }}
                />
              </FormDialog>
              <span className="text-muted-foreground/30 text-xs font-normal">•</span>
              <Button variant="link" className="h-auto p-0 text-xs font-normal" asChild>
                <Link href="/maintenance">Lihat Semua</Link>
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-xs">Prediksi penggantian part selanjutnya.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthData?.components.map(({ component, remainingKm, status }) => (
            <div key={component.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${status === 'danger' ? 'bg-orange-500/10' : status === 'warning' ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                  <IconTool className={`h-4 w-4 ${status === 'danger' ? 'text-orange-500' : status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{component.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {status === "danger" ? `Ganti dalam ${remainingKm} km` : status === "warning" ? `Sisa ${remainingKm} km` : "Kondisi Baik"}
                  </p>
                </div>
              </div>
              <IconArrowRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
          ))}
          {(!healthData?.components || healthData.components.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada komponen.</p>
          )}
        </CardContent>
      </Card>

      {/* Tax Status Card */}
      <Card className="border-none bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            Status Pajak
          </CardTitle>
          <CardDescription className="text-xs">Informasi pajak kendaraan tahunan.</CardDescription>
        </CardHeader>
        <CardContent>
          {vehicle.taxDueDate ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  healthData?.taxStatus?.status === "danger"
                    ? "bg-red-500/10"
                    : healthData?.taxStatus?.status === "warning"
                      ? "bg-orange-500/10"
                      : "bg-green-500/10",
                )}>
                  <IconReceipt className={cn(
                    "h-5 w-5",
                    healthData?.taxStatus?.status === "danger"
                      ? "text-red-500"
                      : healthData?.taxStatus?.status === "warning"
                        ? "text-orange-500"
                        : "text-green-500",
                  )} />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Jatuh tempo {vehicle.taxDueDate}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {healthData?.taxStatus?.status === "danger"
                      ? `Terlambat ${Math.abs(healthData.taxStatus.daysRemaining ?? 0)} hari`
                      : healthData?.taxStatus?.status === "warning"
                        ? `Sisa ${healthData.taxStatus.daysRemaining} hari lagi`
                        : healthData?.taxStatus?.status === "safe"
                          ? "Masih panjang"
                          : "—"}
                    {vehicle.taxAmount > 0 && ` • Rp ${vehicle.taxAmount.toLocaleString("id-ID")}`}
                  </p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-extrabold uppercase px-2 py-1 rounded-md",
                healthData?.taxStatus?.status === "danger"
                  ? "bg-red-500/10 text-red-500"
                  : healthData?.taxStatus?.status === "warning"
                    ? "bg-orange-500/10 text-orange-500"
                    : healthData?.taxStatus?.status === "safe"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground",
              )}>
                {healthData?.taxStatus?.status === "danger"
                  ? "Overdue"
                  : healthData?.taxStatus?.status === "warning"
                    ? `H-${healthData.taxStatus.daysRemaining}`
                    : healthData?.taxStatus?.status === "safe"
                      ? "Aman"
                      : "—"}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Data pajak belum diatur. Edit kendaraan untuk menambahkan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-none bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            Riwayat Odometer
          </CardTitle>
          <CardDescription className="text-xs">Catatan riwayat pembaruan odometer kendaraan.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {odometerReadings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada catatan odometer.</p>
            ) : (
              odometerReadings.map((odo) => (
                <div key={odo.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <IconGauge className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{odo.reading.toLocaleString("id-ID")} km</p>
                      <p className="text-[10px] text-muted-foreground">{odo.date} {odo.notes ? `• ${odo.notes}` : ""}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-full"
                    onClick={async () => {
                      if (confirm("Hapus catatan odometer ini?")) {
                        try {
                          await deleteOdometerReading(odo.id, vehicle.id)
                          toast.success("Catatan odometer berhasil dihapus")
                        } catch {
                          toast.error("Gagal menghapus catatan odometer")
                        }
                      }
                    }}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <FormDialog
          title="Isi Bensin"
          description={vehicle.name}
          trigger={
            <Button className="gap-2 h-12" variant="outline">
              <IconDroplet className="h-4 w-4 text-blue-500" />
              Isi Bensin
            </Button>
          }
          open={openFuel}
          onOpenChange={setOpenFuel}
        >
          <FuelForm
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            onSuccess={() => { setOpenFuel(false); refresh() }}
          />
        </FormDialog>

        <FormDialog
          title="Tambah Servis"
          description={vehicle.name}
          trigger={
            <Button className="gap-2 h-12" variant="outline">
              <IconPlus className="h-4 w-4" />
              Servis Baru
            </Button>
          }
          open={openService}
          onOpenChange={setOpenService}
        >
          <ServiceForm
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            onSuccess={() => { setOpenService(false); refresh() }}
          />
        </FormDialog>
      </div>

      <Button
        className="w-full h-12 gap-2 font-bold"
        variant="outline"
        onClick={async () => {
          if (!vehicle.taxDueDate) {
            toast.error("Atur tanggal pajak dulu di edit kendaraan")
            return
          }
          try {
            const today = new Date()
            const nextYear = new Date(today)
            nextYear.setFullYear(nextYear.getFullYear() + 1)
            const due = new Date(vehicle.taxDueDate)
            const nextDue = new Date(due)
            nextDue.setFullYear(nextDue.getFullYear() + 1)
            await updateVehicle(vehicle.id, {
              lastTaxPaidDate: today.toISOString().split("T")[0],
              taxDueDate: nextDue.toISOString().split("T")[0],
            })
            toast.success("Pembayaran pajak berhasil dicatat")
            refresh()
          } catch {
            toast.error("Gagal mencatat pembayaran pajak")
          }
        }}
      >
        <IconReceipt className="h-4 w-4" />
        Bayar Pajak
      </Button>

      <FormDialog
        title="Update Odometer"
        description={vehicle.name}
        trigger={
          <Button className="w-full h-12 bg-primary font-bold">
            Update Odometer Sekarang
          </Button>
        }
        open={openOdometer}
        onOpenChange={setOpenOdometer}
      >
        <OdometerForm
          vehicleId={vehicle.id}
          vehicleName={vehicle.name}
          onSuccess={() => { setOpenOdometer(false); refresh() }}
        />
      </FormDialog>

      <FormDialog
        title="Edit Kendaraan"
        description={vehicle.name}
        open={openEdit}
        onOpenChange={setOpenEdit}
      >
        <VehicleForm
          vehicle={vehicle}
          onSuccess={() => {
            setOpenEdit(false)
            refresh()
          }}
        />
      </FormDialog>
    </motion.div>
  )
}
