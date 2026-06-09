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
import { InputGroup, InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { IconLoader2 } from "@tabler/icons-react"

const formSchema = z.object({
  liters: z.coerce.number().min(0.1, "Liter harus diisi"),
  amount: z.coerce.number().min(1, "Biaya harus diisi"),
  fuelType: z.string().min(1, "Pilih jenis BBM"),
  date: z.string().min(1, "Tanggal harus diisi"),
  kmPerLiter: z.coerce.number().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  vehicleName: string
  onSuccess?: () => void
}

export function FuelForm({ vehicleId, vehicleName, onSuccess }: Props) {
  const { createFuelLog, vehicleHealth } = useVehicleStore()
  const latestOdo = vehicleHealth?.latestOdo ?? 0
  const prevLog = vehicleHealth?.latestFuelLog
  const estimatedKmL = prevLog?.odoReading && latestOdo > prevLog.odoReading && prevLog.liters > 0
    ? Math.round(((latestOdo - prevLog.odoReading) / prevLog.liters) * 10) / 10
    : null

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      liters: undefined as unknown as number,
      amount: undefined as unknown as number,
      fuelType: "",
      date: new Date().toISOString().split("T")[0],
      kmPerLiter: undefined,
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
        odoReading: latestOdo,
        kmPerLiter: values.kmPerLiter || null,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="liters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liter</FormLabel>
                <FormControl>
                  <InputGroup>
                    <NumberInput placeholder="3,5" value={field.value} onChange={field.onChange} />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>L</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
                <FormLabel>Biaya</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>Rp</InputGroupText>
                    </InputGroupAddon>
                    <NumberInput placeholder="35.000" value={field.value} onChange={field.onChange} />
                  </InputGroup>
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
          name="kmPerLiter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konsumsi BBM (opsional)</FormLabel>
              <FormControl>
                <InputGroup>
                  <NumberInput placeholder="—" value={field.value} onChange={field.onChange} />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>km/L</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              {estimatedKmL !== null && (
                <p className="text-[10px] text-muted-foreground">
                  Estimasi dari pengisian sebelumnya: <span className="font-semibold text-foreground">{estimatedKmL} km/L</span>
                </p>
              )}
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
