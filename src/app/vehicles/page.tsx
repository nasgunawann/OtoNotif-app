"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCar, IconMotorbike, IconPlus, IconChevronRight, IconGauge, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

import { getPageTitle } from "@/lib/navigation"
import { usePathname } from "next/navigation"

export default function VehiclesPage() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const vehicles = [
    {
      id: "1",
      name: "Supra Bapak",
      type: "motor",
      image: "/motorcycle_supra_mockup.png",
      odo: "12.500 km",
      lastUpdate: "2 hari lalu",
      specs: "125cc • 4L"
    },
    {
      id: "2",
      name: "Chery Omoda E5",
      type: "mobil",
      image: "/car_civic_mockup.png",
      odo: "45.200 km",
      lastUpdate: "1 minggu lalu",
      specs: "1500cc • 47L"
    }
  ]

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
        <Button size="sm" className="hidden md:flex gap-2">
          <IconPlus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {vehicles.map((v) => (
          <Link key={v.id} href={`/vehicles/${v.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-none bg-card/50 flex flex-col h-full">
              <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  {v.type === "motor" ? <IconMotorbike className="h-2.5 w-2.5" /> : <IconCar className="h-2.5 w-2.5" />}
                  {v.type}
                </div>
              </div>
              <CardContent className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{v.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-medium">{v.specs}</p>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <IconGauge className="h-3 w-3 text-primary shrink-0" />
                    <p className="text-[10px] font-semibold truncate">{v.odo}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconCalendar className="h-3 w-3 text-orange-500 shrink-0" />
                    <p className="text-[10px] font-semibold truncate">{v.lastUpdate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        <button className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-6 bg-muted/5 hover:bg-muted/10 transition-colors aspect-square md:aspect-auto">
          <div className="bg-muted p-2 rounded-full mb-2">
            <IconPlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tambah</span>
        </button>
      </div>
    </motion.div>
  )
}
