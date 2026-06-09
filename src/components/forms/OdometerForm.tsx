"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { IconLoader2 } from "@tabler/icons-react"

const formSchema = z.object({
  reading: z.coerce.number().int().min(1, "Odometer harus diisi"),
  date: z.string().min(1, "Tanggal harus diisi"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  vehicleName: string
  onSuccess?: () => void
}

export function OdometerForm({ vehicleId, vehicleName, onSuccess }: Props) {
  const { createOdometerReading, vehicleHealth } = useVehicleStore()
  const latestOdo = vehicleHealth?.latestOdo ?? 0

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reading: undefined as unknown as number,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    if (latestOdo > 0 && values.reading <= latestOdo) {
      form.setError("reading", {
        type: "manual",
        message: `Odometer baru harus lebih besar dari odometer saat ini (${latestOdo.toLocaleString()} km)`,
      })
      return
    }

    try {
      await createOdometerReading({
        vehicleId,
        reading: values.reading,
        date: values.date,
        notes: values.notes || "",
      })
      toast.success(`Odometer ${vehicleName} diperbarui`)
      onSuccess?.()
    } catch {
      toast.error("Gagal menyimpan odometer")
    }
  }

  const displayOdo = latestOdo > 0 ? latestOdo.toLocaleString("id-ID") : "—"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="reading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odometer (km)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="12.500" {...field} />
              </FormControl>
              <p className="text-[10px] text-muted-foreground">
                Odometer saat ini: <span className="font-semibold text-foreground">{displayOdo}</span> km
                {latestOdo > 0 && " — isi angka yang lebih besar dari odometer saat ini"}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Isi bensin, servis, dll" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full h-12 text-base gap-2" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </form>
    </Form>
  )
}
