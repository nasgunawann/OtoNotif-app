"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconPlus, IconGauge, IconDroplet, IconTool } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { OdometerForm } from "@/components/forms/OdometerForm"
import { FuelForm } from "@/components/forms/FuelForm"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { api } from "@/lib/services/api"
import { useMediaQuery } from "@/hooks/use-media-query"
import { IconChevronLeft } from "@tabler/icons-react"

type Step = "menu" | "odometer" | "fuel" | "service"

function QuickInputContent({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("menu")
  const [vehicles, setVehicles] = useState<any[]>([])

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(() => {})
  }, [])

  const primary = vehicles.find((v: any) => v.isPrimary) || vehicles[0]

  const formProps = {
    vehicleId: primary?.id || "",
    vehicleName: primary?.name || "",
    onSuccess,
  }

  if (step !== "menu") {
    const Form = step === "odometer" ? OdometerForm : step === "fuel" ? FuelForm : ServiceForm
    const titles = { odometer: "Update Odometer", fuel: "Isi Bensin", service: "Tambah Riwayat Servis" }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setStep("menu")} className="-ml-2">
            <IconChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="font-semibold text-sm">{titles[step]}</p>
            <p className="text-xs text-muted-foreground">{formProps.vehicleName}</p>
          </div>
        </div>
        <Form {...formProps} />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button variant="outline" className="h-14 justify-start text-left px-4 text-base" onClick={() => setStep("odometer")}>
          <div className="bg-primary/10 p-2.5 rounded-full mr-4">
            <IconGauge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Update Odometer</div>
            <div className="text-xs text-muted-foreground">Perbarui jarak tempuh terakhir</div>
          </div>
        </Button>
        <Button variant="outline" className="h-14 justify-start text-left px-4 text-base" onClick={() => setStep("fuel")}>
          <div className="bg-blue-500/10 p-2.5 rounded-full mr-4">
            <IconDroplet className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="font-semibold">Isi Bensin</div>
            <div className="text-xs text-muted-foreground">Catat pengisian bahan bakar</div>
          </div>
        </Button>
        <Button variant="outline" className="h-14 justify-start text-left px-4 text-base" onClick={() => setStep("service")}>
          <div className="bg-orange-500/10 p-2.5 rounded-full mr-4">
            <IconTool className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <div className="font-semibold">Tambah Riwayat Servis</div>
            <div className="text-xs text-muted-foreground">Catat servis atau pergantian part</div>
          </div>
        </Button>
      </div>
    </>
  )
}

export function QuickInputDrawer({ children }: { children?: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = useState(false)

  function handleSuccess() {
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button className="w-full gap-2" size="lg">
              <IconPlus className="h-5 w-5" />
              Input Cepat
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Input Cepat</DialogTitle>
            <DialogDescription>Catat aktivitas kendaraanmu dengan cepat.</DialogDescription>
          </DialogHeader>
          <QuickInputContent onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <IconPlus className="h-6 w-6" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Input Cepat</DrawerTitle>
          <DrawerDescription>Catat aktivitas kendaraanmu dengan cepat.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <QuickInputContent onSuccess={handleSuccess} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="ghost">Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
