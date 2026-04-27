"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconActivity, IconCar, IconDroplet, IconTool, IconGauge, IconChevronRight, IconAlertTriangle } from "@tabler/icons-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function Home() {
  // Mock Primary Vehicle Data
  const primaryVehicle = {
    id: "1",
    name: "Supra Bapak",
    image: "/motorcycle_supra_mockup.png",
    odo: "12.500 km",
    fuel: {
      current: 3.2,
      max: 4.0,
      percent: (3.2 / 4.0) * 100,
      avg: "45 km/L"
    },
    components: [
      { name: "Oli Mesin", current: 1800, max: 2000 },
      { name: "Filter Udara", current: 400, max: 5000 },
      { name: "Ban Luar", current: 12000, max: 15000 },
      { name: "V-Belt", current: 8500, max: 10000 },
    ]
  }

  // Helper to get color based on percentage
  const getStatusColor = (current: number, max: number) => {
    const usagePercent = (current / max) * 100
    if (usagePercent > 85) return "bg-red-500"
    if (usagePercent > 70) return "bg-orange-500"
    return "bg-green-500"
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-20 md:pb-6"
    >
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beranda</h1>
          <p className="text-muted-foreground">Halo, Nanas! Cek kondisi kendaraan utamamu.</p>
        </div>
        <Button variant="outline" size="sm">Ganti Kendaraan Utama</Button>
      </div>

      {/* Primary Vehicle Featured Card */}
      <Card className="overflow-hidden border-none bg-linear-to-br from-primary/5 via-background to-background shadow-xl ring-1 ring-primary/10 group">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                <IconCar className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">{primaryVehicle.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <CardDescription className="text-xs font-medium">Terhubung • Aktif</CardDescription>
                </div>
              </div>
            </div>
            <Link href={`/vehicles/${primaryVehicle.id}`}>
              <Button variant="secondary" size="sm" className="h-8 px-3 text-xs font-bold rounded-full gap-1">
                Detail <IconChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Main Stats: Odo & Fuel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Odometer Card */}
            <div className="relative overflow-hidden bg-muted/30 p-5 rounded-[2rem] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-primary/80">
                <IconGauge className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Odometer</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{primaryVehicle.odo}</div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <span className="text-green-600 font-bold">+120 km</span> minggu ini
              </div>
            </div>

            {/* Fuel Card - Redesigned as single visual card */}
            <div className="relative overflow-hidden bg-blue-500/5 p-5 rounded-[2rem] border border-blue-500/10 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-500/80">
                    <IconDroplet className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Bahan Bakar</span>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                    {primaryVehicle.fuel.current}L <span className="text-sm font-medium text-muted-foreground tracking-normal">/ {primaryVehicle.fuel.max}L</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-blue-500">{primaryVehicle.fuel.avg}</div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-medium">Konsumsi Rata-rata</div>
                </div>
              </div>

              {/* Tank Progress Bar */}
              <div className="relative h-4 w-full bg-blue-500/10 rounded-full overflow-hidden border border-blue-500/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${primaryVehicle.fuel.percent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Component Quick Check */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-1">
              <IconActivity className="h-3 w-3" /> Pemantauan Komponen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {primaryVehicle.components.map((comp) => {
                const remaining = comp.max - comp.current
                const progress = (comp.current / comp.max) * 100
                const colorClass = getStatusColor(comp.current, comp.max)

                return (
                  <div key={comp.name} className="group p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-sm font-bold tracking-tight">{comp.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Sisa <span className={cn("font-bold", remaining < 500 ? "text-orange-500" : "")}>{remaining} km</span> lagi
                        </p>
                      </div>
                      <div className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {comp.current} / {comp.max} km
                      </div>
                    </div>

                    {/* Progress Bar Component */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className={cn("h-full rounded-full transition-all duration-500", colorClass)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Stats & Quick Action */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Card className="bg-card/50 border-none ring-1 ring-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Biaya Operasional</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold tracking-tight">Rp 450.000</div>
              <p className="text-[8px] text-green-500 font-bold uppercase mt-1">Bulan Ini</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-none ring-1 ring-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Catatan BBM</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm font-bold flex items-center gap-2">
                <IconDroplet className="h-4 w-4 text-blue-500" /> Pertamax
              </div>
              <p className="text-[8px] text-muted-foreground font-medium mt-1 italic">Kemarin, 17:45</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
