"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  IconChevronLeft,
  IconSettings,
  IconGauge,
  IconCalendar,
  IconDroplet,
  IconTool,
  IconActivity,
  IconPlus,
  IconArrowRight
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  // Mock data based on ID
  const vehicle = id === "1" ? {
    name: "Supra Bapak",
    type: "motor",
    image: "/motorcycle_supra_mockup.png",
    odo: "12.500 km",
    lastUpdate: "2 hari lalu",
    engine: "125cc",
    fuelCapacity: "4L",
    health: 85,
    maintenance: [
      { part: "Oli Mesin", status: "danger", info: "Ganti dalam 200 km" },
      { part: "Ban Depan", status: "safe", info: "Kondisi Baik" },
      { part: "Aki", status: "safe", info: "Tegangan Normal" },
    ]
  } : {
    name: "Civic Turbo",
    type: "mobil",
    image: "/car_civic_mockup.png",
    odo: "45.200 km",
    lastUpdate: "1 minggu lalu",
    engine: "1500cc Turbo",
    fuelCapacity: "47L",
    health: 95,
    maintenance: [
      { part: "Oli Mesin", status: "safe", info: "Aman 4.8k km lagi" },
      { part: "Filter Udara", status: "safe", info: "Kondisi Baik" },
      { part: "Busi", status: "safe", info: "Kondisi Baik" },
    ]
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Header Navigation - Hidden on mobile because Topbar handles it */}
      <div className="hidden md:flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <IconChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold">Detail Kendaraan</h1>
        <Button variant="ghost" size="icon">
          <IconSettings className="h-5 w-5" />
        </Button>
      </div>

      {/* Vehicle Hero */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-inner">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
          <h2 className="text-2xl font-bold text-white">{vehicle.name}</h2>
          <p className="text-white/80 text-sm font-medium">{vehicle.engine} • {vehicle.fuelCapacity}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-card/50">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <IconGauge className="h-5 w-5 text-primary mb-2" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Odometer</p>
            <p className="font-bold">{vehicle.odo}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/50">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <IconActivity className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Kesehatan</p>
            <p className="font-bold text-green-500">{vehicle.health}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Status */}
      <Card className="border-none bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between">
            Status Komponen
            <Button variant="link" className="h-auto p-0 text-xs">Lihat Semua</Button>
          </CardTitle>
          <CardDescription className="text-xs">Prediksi penggantian part selanjutnya.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehicle.maintenance.map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${m.status === 'danger' ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
                  <IconTool className={`h-4 w-4 ${m.status === 'danger' ? 'text-orange-500' : 'text-green-500'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{m.part}</p>
                  <p className="text-[10px] text-muted-foreground">{m.info}</p>
                </div>
              </div>
              <IconArrowRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
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
