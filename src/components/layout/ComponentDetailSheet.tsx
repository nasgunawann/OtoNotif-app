"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { COMPONENT_TEMPLATES } from "@/lib/component-templates"
import { IconTool, IconTrash, IconAlertTriangle, IconInfoCircle, IconCoin } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ComponentHealth, VehicleType } from "@/lib/types"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { FormDialog } from "@/components/forms/FormDialog"

type Props = {
  data: ComponentHealth
  vehicleId: string
  vehicleName: string
  vehicleType: VehicleType
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function ComponentDetailSheet({
  data,
  vehicleId,
  vehicleName,
  vehicleType,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { deleteComponent } = useVehicleStore()
  const [deleting, setDeleting] = useState(false)
  const [openService, setOpenService] = useState(false)

  const { component, currentOdo, usedKm, remainingKm, usagePercent, status } = data
  const templates = COMPONENT_TEMPLATES[vehicleType]
  const template = templates.find((t) => t.name === component.name)

  const statusColors = {
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    safe: "bg-green-500/10 text-green-500 border-green-500/20",
  } as const

  const statusLabels = {
    danger: "Perlu Ganti",
    warning: "Segera Cek",
    safe: "Kondisi Baik",
  } as const

  const progressColor =
    status === "danger"
      ? "bg-red-500"
      : status === "warning"
        ? "bg-orange-500"
        : "bg-green-500"

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteComponent(component.id, vehicleId)
      toast.success(`${component.name} berhasil dihapus dari tracking`)
      onOpenChange(false)
      onDeleted?.()
    } catch {
      toast.error("Gagal menghapus komponen")
    } finally {
      setDeleting(false)
    }
  }

  const content = (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn("text-[10px] font-bold uppercase px-2.5 py-1", statusColors[status])}
        >
          {statusLabels[status]}
        </Badge>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Pemakaian</span>
          <span className="font-mono font-bold">{usedKm.toLocaleString("id-ID")} / {component.intervalKm.toLocaleString("id-ID")} km</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", progressColor)}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={cn(
            "font-bold",
            status === "danger" ? "text-red-500" : status === "warning" ? "text-orange-500" : "text-green-500",
          )}>
            Sisa {remainingKm.toLocaleString("id-ID")} km
          </span>
          <span className="text-muted-foreground">Odo: {currentOdo.toLocaleString("id-ID")} km</span>
        </div>
      </div>

      <Separator />

      {/* Description */}
      {template?.description && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            <IconInfoCircle className="h-3.5 w-3.5" />
            Deskripsi
          </div>
          <p className="text-sm">{template.description}</p>
        </div>
      )}

      {/* Estimate Cost */}
      {template?.estimatedCost && template.estimatedCost > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            <IconCoin className="h-3.5 w-3.5" />
            Estimasi Biaya
          </div>
          <p className="text-sm font-bold">
            Rp {template.estimatedCost.toLocaleString("id-ID")}
          </p>
        </div>
      )}

      {/* Warning Signs */}
      {template?.warningSigns && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            <IconAlertTriangle className="h-3.5 w-3.5" />
            Tanda-tanda Perlu Ganti
          </div>
          <p className="text-sm text-muted-foreground">{template.warningSigns}</p>
        </div>
      )}

      {/* Tips */}
      {template?.tips && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Tips Perawatan
          </div>
          <p className="text-sm text-muted-foreground">{template.tips}</p>
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="space-y-2">
        <FormDialog
          title="Catat Servis"
          description={`Servis ${component.name} untuk ${vehicleName}`}
          open={openService}
          onOpenChange={setOpenService}
          trigger={
            <Button className="w-full h-11 gap-2 font-bold" size="lg">
              <IconTool className="h-4 w-4" />
              Catat Servis Komponen Ini
            </Button>
          }
        >
          <ServiceForm
            vehicleId={vehicleId}
            vehicleName={vehicleName}
            defaultComponentId={component.id}
            defaultDescription={`Ganti ${component.name}`}
            onSuccess={() => {
              setOpenService(false)
              onOpenChange(false)
              onDeleted?.()
            }}
          />
        </FormDialog>

        <Button
          variant="outline"
          size="lg"
          className="w-full h-11 gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/5 border-red-500/20"
          disabled={deleting}
          onClick={handleDelete}
        >
          <IconTrash className="h-4 w-4" />
          {deleting ? "Menghapus..." : "Hapus dari Tracking"}
        </Button>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconTool className="h-5 w-5 text-primary" />
              {component.name}
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap dan edukasi komponen.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="flex items-center gap-2">
            <IconTool className="h-5 w-5 text-primary" />
            {component.name}
          </SheetTitle>
          <SheetDescription>
            Informasi lengkap dan edukasi komponen.
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
