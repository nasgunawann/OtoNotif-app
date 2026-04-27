"use client"

import * as React from "react"
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

export function QuickInputDrawer({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children || (
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <IconPlus className="h-6 w-6" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Input Cepat</DrawerTitle>
            <DrawerDescription>Catat aktivitas kendaraanmu dengan cepat.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex flex-col gap-3">
            <Button variant="outline" className="h-16 justify-start text-left px-4" size="lg">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <IconGauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-base">Update Odometer</div>
                <div className="text-xs text-muted-foreground">Perbarui jarak tempuh terakhir</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16 justify-start text-left px-4" size="lg">
              <div className="bg-blue-500/10 p-2 rounded-full mr-4">
                <IconDroplet className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-base">Isi Bensin</div>
                <div className="text-xs text-muted-foreground">Catat pengisian bahan bakar</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16 justify-start text-left px-4" size="lg">
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
