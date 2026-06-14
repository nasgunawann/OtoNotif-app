"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { IconCar, IconMotorbike, IconPlus, IconGauge, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { getPageTitle } from "@/lib/navigation"
import { usePathname } from "next/navigation"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { FormDialog } from "@/components/forms/FormDialog"
import { VehicleForm } from "@/components/forms/VehicleForm"
import { Badge } from "@/components/ui/badge"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function VehiclesPage() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const { vehicles, fetchVehicles, loading } = useVehicleStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-20 md:pb-0"
    >
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">Kelola koleksi kendaraan Anda.</p>
        </div>
        <FormDialog
          title="Tambah Kendaraan"
          trigger={
            <Button size="sm" className="hidden md:flex gap-2">
              <IconPlus className="h-4 w-4" /> Tambah
            </Button>
          }
          open={open}
          onOpenChange={setOpen}
        >
          <VehicleForm onSuccess={() => { setOpen(false); fetchVehicles() }} />
        </FormDialog>
      </div>

      {loading && vehicles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-muted animate-pulse h-24 md:h-48 w-full" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="p-12 text-center">
          <IconCar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-bold mb-2">Belum Ada Kendaraan</h2>
          <p className="text-sm text-muted-foreground mb-4">Tambahkan kendaraan pertama Anda.</p>
          <FormDialog
            title="Tambah Kendaraan"
            trigger={
              <Button className="gap-2">
                <IconPlus className="h-4 w-4" /> Tambah Kendaraan
              </Button>
            }
            open={open}
            onOpenChange={setOpen}
          >
            <VehicleForm onSuccess={() => { setOpen(false); fetchVehicles() }} />
          </FormDialog>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicles/${v.id}`} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl block">
              <Card className="overflow-hidden group-hover:shadow-lg transition-shadow border border-border/60 bg-card flex flex-row md:flex-col h-full rounded-xl">
                <div className="h-24 w-24 md:w-full md:aspect-video relative bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-muted-foreground/30">
                      {v.type === "motor" ? <IconMotorbike className="h-10 w-10 md:h-16 md:w-16" /> : <IconCar className="h-10 w-10 md:h-16 md:w-16" />}
                    </div>
                  )}
                  <Badge variant="secondary" className="absolute top-1 left-1 text-[10px] md:top-2 md:left-2 md:text-xs font-bold uppercase tracking-wider gap-1 shadow-sm">
                    {v.type === "motor" ? <IconMotorbike className="h-3 w-3" /> : <IconCar className="h-3 w-3" />}
                    {v.type}
                  </Badge>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-bold leading-tight truncate">{v.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{v.engine} • {v.fuelCapacity}L</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 md:mt-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IconGauge className="h-3.5 w-3.5 text-primary shrink-0" />
                      <p className="text-xs font-semibold truncate">
                        {v.latestOdo ? `${v.latestOdo.toLocaleString()} km` : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IconCalendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      <p className="text-xs font-semibold truncate">
                        {v.latestOdoDate ? v.latestOdoDate : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          <FormDialog
            title="Tambah Kendaraan"
            trigger={
              <Button variant="outline" className="border-2 border-dashed border-muted-foreground/30 flex flex-row md:flex-col items-center justify-center p-6 bg-muted/5 hover:bg-muted/10 h-24 md:h-auto w-full md:aspect-video rounded-xl gap-2">
                <div className="bg-muted p-2 rounded-full">
                  <IconPlus className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tambah Kendaraan</span>
              </Button>
            }
            open={open}
            onOpenChange={setOpen}
          >
            <VehicleForm onSuccess={() => { setOpen(false); fetchVehicles() }} />
          </FormDialog>
        </div>
      )}
    </motion.div>
  )
}
