"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconPlus, IconCheck, IconInfoCircle } from "@tabler/icons-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { COMPONENT_TEMPLATES } from "@/lib/component-templates"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Vehicle } from "@/lib/types"

type Props = {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SelectComponentsDialog({ vehicle, open, onOpenChange, onSuccess }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { createComponent, vehicleHealth } = useVehicleStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState(false)

  const existingNames = new Set(
    vehicleHealth?.components.map((c) => c.component.name) ?? []
  )

  const available = COMPONENT_TEMPLATES[vehicle.type].filter(
    (t) => !existingNames.has(t.name)
  )

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(new Set())
    }
  }, [open])

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function handleAdd() {
    if (selected.size === 0) return
    setAdding(true)
    const selectedTemplates = available.filter((t) => selected.has(t.name))
    try {
      const latestOdo = vehicleHealth?.latestOdo ?? 0
      for (const t of selectedTemplates) {
        await createComponent({
          vehicleId: vehicle.id,
          name: t.name,
          intervalKm: t.intervalKm,
          lastReplacedOdo: latestOdo,
        })
      }
      toast.success(`${selected.size} komponen berhasil ditambahkan`)
      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error("Gagal menambahkan komponen")
    } finally {
      setAdding(false)
    }
  }

  const content = (
    <div className="space-y-3">
      {available.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <IconCheck className="h-8 w-8 mx-auto text-green-500 mb-2" />
          <p>Semua komponen umum sudah ditambahkan</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Pilih komponen yang ingin ditambahkan ke tracking:
          </p>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
            {available.map((t) => {
              const isSelected = selected.has(t.name)
              return (
                <button
                  key={t.name}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border",
                    isSelected
                      ? "bg-primary/5 border-primary/30"
                      : "bg-background border-border/50 hover:border-primary/20",
                  )}
                  onClick={() => toggle(t.name)}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30",
                  )}>
                    {isSelected && <IconCheck className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Interval {t.intervalKm.toLocaleString("id-ID")} km
                      {t.estimatedCost ? ` • Rp ${t.estimatedCost.toLocaleString("id-ID")}` : ""}
                    </p>
                  </div>
                  <IconInfoCircle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              {selected.size} dari {available.length} dipilih
            </p>
            <Button
              size="sm"
              className="gap-1.5 font-bold"
              disabled={selected.size === 0 || adding}
              onClick={handleAdd}
            >
              {adding ? (
                "Menambahkan..."
              ) : (
                <>
                  <IconPlus className="h-4 w-4" />
                  Tambah ({selected.size})
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Tambah Komponen Tracking</DialogTitle>
            <DialogDescription>
              Pilih komponen yang ingin dipantau untuk {vehicle.name}.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tambah Komponen Tracking</DrawerTitle>
          <DrawerDescription>
            Pilih komponen yang ingin dipantau untuk {vehicle.name}.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {content}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
