"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconPlus, IconGauge, IconDroplet, IconTool } from "@tabler/icons-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { OdometerForm } from "@/components/forms/OdometerForm"
import { FuelForm } from "@/components/forms/FuelForm"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { api } from "@/lib/services/api"

export function QuickInputDrawer({
  children,
}: {
  children?: React.ReactNode
}) {
  const [step, setStep] = useState<"menu" | "odometer" | "fuel" | "service">("menu")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(() => {})
  }, [])

  const primary = vehicles.find((v) => v.isPrimary) || vehicles[0]

  function reset() {
    setStep("menu")
    setSelectedVehicle(null)
  }

  const formProps = {
    vehicleId: selectedVehicle?.id || primary?.id || "",
    vehicleName: selectedVehicle?.name || primary?.name || "",
    onSuccess: reset,
  }

  return (
    <Drawer onOpenChange={(open) => { if (!open) reset() }}>
      <DrawerTrigger asChild>
        {children || (
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <IconPlus className="h-6 w-6" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        {step === "menu" && (
          <>
            <DrawerHeader>
              <DrawerTitle>Input Cepat</DrawerTitle>
              <DrawerDescription>Catat aktivitas kendaraanmu dengan cepat.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 flex flex-col gap-3">
              <Button
                variant="outline"
                className="h-16 justify-start text-left px-4"
                size="lg"
                onClick={() => setStep("odometer")}
              >
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <IconGauge className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-base">Update Odometer</div>
                  <div className="text-xs text-muted-foreground">Perbarui jarak tempuh terakhir</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 justify-start text-left px-4"
                size="lg"
                onClick={() => setStep("fuel")}
              >
                <div className="bg-blue-500/10 p-2 rounded-full mr-4">
                  <IconDroplet className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-base">Isi Bensin</div>
                  <div className="text-xs text-muted-foreground">Catat pengisian bahan bakar</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 justify-start text-left px-4"
                size="lg"
                onClick={() => setStep("service")}
              >
                <div className="bg-orange-500/10 p-2 rounded-full mr-4">
                  <IconTool className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold text-base">Tambah Riwayat Servis</div>
                  <div className="text-xs text-muted-foreground">Catat servis atau pergantian part</div>
                </div>
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="ghost">Batal</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}

        {step === "odometer" && (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>Update Odometer</DrawerTitle>
              <DrawerDescription>{formProps.vehicleName}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <OdometerForm {...formProps} />
            </div>
            <DrawerFooter className="pt-2">
              <Button variant="ghost" onClick={() => setStep("menu")}>Kembali</Button>
            </DrawerFooter>
          </>
        )}

        {step === "fuel" && (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>Isi Bensin</DrawerTitle>
              <DrawerDescription>{formProps.vehicleName}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <FuelForm {...formProps} />
            </div>
            <DrawerFooter className="pt-2">
              <Button variant="ghost" onClick={() => setStep("menu")}>Kembali</Button>
            </DrawerFooter>
          </>
        )}

        {step === "service" && (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>Tambah Riwayat Servis</DrawerTitle>
              <DrawerDescription>{formProps.vehicleName}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <ServiceForm {...formProps} />
            </div>
            <DrawerFooter className="pt-2">
              <Button variant="ghost" onClick={() => setStep("menu")}>Kembali</Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
