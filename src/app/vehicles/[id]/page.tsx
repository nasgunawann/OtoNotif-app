"use client"

import { useEffect } from "react"
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
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
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
  const { selectedVehicle, vehicleHealth, fetchVehicle, fetchVehicleHealth, fetchComponents, components, loading } = useVehicleStore()

  useEffect(() => {
    if (id) {
      fetchVehicle(id)
      fetchVehicleHealth(id)
      fetchComponents(id)
    }
  }, [id, fetchVehicle, fetchVehicleHealth, fetchComponents])

  if (loading && !selectedVehicle) {
    return (
      <div className="space-y-6 pb-24 md:pb-6 animate-pulse">
        <div className="aspect-video rounded-2xl bg-muted" />
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
        <Button variant="ghost" size="icon">
          <IconSettings className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-inner">
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
          <CardTitle className="text-base flex justify-between">
            Status Komponen
            <Button variant="link" className="h-auto p-0 text-xs">Lihat Semua</Button>
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

      <div className="grid grid-cols-2 gap-3">
        <Button className="gap-2 h-12" variant="outline">
          <IconDroplet className="h-4 w-4 text-blue-500" />
          Isi Bensin
        </Button>
        <Button className="gap-2 h-12" variant="outline">
          <IconPlus className="h-4 w-4" />
          Servis Baru
        </Button>
      </div>

      <Button className="w-full h-12 bg-primary font-bold">
        Update Odometer Sekarang
      </Button>
    </motion.div>
  )
}
