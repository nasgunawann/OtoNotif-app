"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { NumberInput } from "@/components/ui/number-input"
import { IconReceipt } from "@tabler/icons-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { toast } from "sonner"
import type { Vehicle } from "@/lib/types"

type Props = {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PayTaxSheet({ vehicle, open, onOpenChange, onSuccess }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { updateVehicle } = useVehicleStore()
  const [amount, setAmount] = useState<number | null>(vehicle.taxAmount)
  const [submitting, setSubmitting] = useState(false)

  async function handlePay() {
    if (!vehicle.taxDueDate) {
      toast.error("Atur tanggal jatuh tempo pajak dulu di edit kendaraan")
      return
    }
    setSubmitting(true)
    try {
      const due = new Date(vehicle.taxDueDate)
      const nextDue = new Date(due)
      nextDue.setFullYear(nextDue.getFullYear() + (vehicle.taxIntervalYears || 1))
      await updateVehicle(vehicle.id, {
        lastTaxPaidDate: new Date().toISOString().split("T")[0],
        taxDueDate: nextDue.toISOString().split("T")[0],
        taxAmount: amount ?? vehicle.taxAmount,
      })
      toast.success("Pembayaran pajak berhasil dicatat")
      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error("Gagal mencatat pembayaran pajak")
    } finally {
      setSubmitting(false)
    }
  }

  const interval = vehicle.taxIntervalYears || 1
  const nextYear = vehicle.taxDueDate
    ? new Date(new Date(vehicle.taxDueDate).getFullYear() + interval, new Date(vehicle.taxDueDate).getMonth(), new Date(vehicle.taxDueDate).getDate())
      .toISOString().split("T")[0]
    : "—"

  const content = (
    <div className="space-y-4">
      <div className="rounded-xl bg-muted/50 p-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Kendaraan</span>
          <span className="font-semibold">{vehicle.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Jatuh tempo</span>
          <span className="font-semibold">{vehicle.taxDueDate || "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Interval</span>
          <span className="font-semibold">{interval} tahun</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Perpanjang ke</span>
          <span className="font-semibold">{nextYear}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nominal Dibayar</p>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>Rp</InputGroupText>
          </InputGroupAddon>
          <NumberInput placeholder="500.000" value={amount} onChange={setAmount} />
        </InputGroup>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 h-11" onClick={() => onOpenChange(false)} disabled={submitting}>
          Batal
        </Button>
        <Button className="flex-1 h-11 gap-2 font-bold" onClick={handlePay} disabled={submitting || !vehicle.taxDueDate}>
          <IconReceipt className="h-4 w-4" />
          {submitting ? "Menyimpan..." : "Konfirmasi Bayar"}
        </Button>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Bayar Pajak</DialogTitle>
            <DialogDescription>Konfirmasi pembayaran pajak kendaraan.</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4">
        <SheetHeader className="text-left px-0 pt-1 pb-0 mb-3">
          <SheetTitle className="text-base">Bayar Pajak</SheetTitle>
          <SheetDescription className="text-xs">Konfirmasi pembayaran pajak kendaraan.</SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
