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
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { IconLoader2 } from "@tabler/icons-react"
import type { Vehicle } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(1, "Nama kendaraan harus diisi"),
  type: z.enum(["motor", "mobil"]),
  engine: z.string().optional(),
  fuelCapacity: z.coerce.number().optional(),
  taxDueDate: z.string().optional(),
  taxReminderDays: z.coerce.number().optional(),
  taxAmount: z.coerce.number().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicle?: Vehicle
  onSuccess?: () => void
}

export function VehicleForm({ vehicle, onSuccess }: Props) {
  const { createVehicle, updateVehicle } = useVehicleStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vehicle?.name || "",
      type: vehicle?.type || "motor",
      engine: vehicle?.engine || "",
      fuelCapacity: vehicle?.fuelCapacity || undefined as unknown as number,
      taxDueDate: vehicle?.taxDueDate || "",
      taxReminderDays: vehicle?.taxReminderDays ?? 30,
      taxAmount: vehicle?.taxAmount || undefined as unknown as number,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, {
          name: values.name,
          type: values.type,
          engine: values.engine || "",
          fuelCapacity: values.fuelCapacity || 0,
          taxDueDate: values.taxDueDate || null,
          taxReminderDays: values.taxReminderDays ?? 30,
          taxAmount: values.taxAmount ?? 0,
        })
        toast.success(`Kendaraan ${values.name} diperbarui`)
      } else {
        await createVehicle({
          name: values.name,
          type: values.type,
          engine: values.engine || "",
          fuelCapacity: values.fuelCapacity || 0,
          taxDueDate: values.taxDueDate || undefined,
          taxReminderDays: values.taxReminderDays ?? 30,
          taxAmount: values.taxAmount ?? 0,
          image: values.type === "motor" ? "/motorcycle_supra_mockup.png" : "/car_civic_mockup.png",
        })
        toast.success(`${values.name} ditambahkan`)
      }
      onSuccess?.()
    } catch {
      toast.error(vehicle ? "Gagal memperbarui kendaraan" : "Gagal menambahkan kendaraan")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kendaraan</FormLabel>
              <FormControl>
                <Input placeholder="Supra Bapak" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="mobil">Mobil</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="engine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesin (opsional)</FormLabel>
              <FormControl>
                <Input placeholder="125cc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fuelCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas BBM (L) (opsional)</FormLabel>
              <FormControl>
                <NumberInput placeholder="4" value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-2" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Pajak Kendaraan
        </p>
        <FormField
          control={form.control}
          name="taxDueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Jatuh Tempo Pajak</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taxReminderDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengingat (H-)</FormLabel>
                <FormControl>
                  <NumberInput placeholder="30" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominal (Rp)</FormLabel>
                <FormControl>
                  <NumberInput placeholder="500.000" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full h-12 text-base gap-2" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            vehicle ? "Simpan Perubahan" : "Tambah Kendaraan"
          )}
        </Button>
      </form>
    </Form>
  )
}
