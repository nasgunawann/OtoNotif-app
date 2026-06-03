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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"

const formSchema = z.object({
  liters: z.coerce.number().min(0.1, "Liter harus diisi"),
  amount: z.coerce.number().min(1, "Biaya harus diisi"),
  fuelType: z.string().min(1, "Pilih jenis BBM"),
  date: z.string().min(1, "Tanggal harus diisi"),
  odoReading: z.coerce.number().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  vehicleName: string
  onSuccess?: () => void
}

export function FuelForm({ vehicleId, vehicleName, onSuccess }: Props) {
  const { createFuelLog } = useVehicleStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      liters: undefined as any,
      amount: undefined as any,
      fuelType: "",
      date: new Date().toISOString().split("T")[0],
      odoReading: undefined as any,
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await createFuelLog({
        vehicleId,
        liters: values.liters,
        amount: values.amount,
        fuelType: values.fuelType,
        date: values.date,
        odoReading: values.odoReading || 0,
        notes: values.notes || "",
      })
      toast.success(`Log BBM ${vehicleName} tersimpan`)
      onSuccess?.()
    } catch {
      toast.error("Gagal menyimpan log BBM")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="liters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liter</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="3.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biaya (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="35000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis BBM</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pertamax">Pertamax</SelectItem>
                  <SelectItem value="Pertalite">Pertalite</SelectItem>
                  <SelectItem value="Pertamax Turbo">Pertamax Turbo</SelectItem>
                  <SelectItem value="Solar">Solar</SelectItem>
                  <SelectItem value="Dexlite">Dexlite</SelectItem>
                  <SelectItem value="Pertamina Dex">Pertamina Dex</SelectItem>
                </SelectContent>
              </Select>
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
          name="odoReading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odometer (opsional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="12500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  )
}
