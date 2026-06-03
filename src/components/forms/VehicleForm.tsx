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
  name: z.string().min(1, "Nama kendaraan harus diisi"),
  type: z.enum(["motor", "mobil"]),
  engine: z.string().optional(),
  fuelCapacity: z.coerce.number().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  onSuccess?: () => void
}

export function VehicleForm({ onSuccess }: Props) {
  const { createVehicle } = useVehicleStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "motor",
      engine: "",
      fuelCapacity: undefined as any,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await createVehicle({
        name: values.name,
        type: values.type,
        engine: values.engine || "",
        fuelCapacity: values.fuelCapacity || 0,
        image: values.type === "motor" ? "/motorcycle_supra_mockup.png" : "/car_civic_mockup.png",
      })
      toast.success(`${values.name} ditambahkan`)
      onSuccess?.()
    } catch {
      toast.error("Gagal menambahkan kendaraan")
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
                <Input type="number" step="0.1" placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Menyimpan..." : "Tambah Kendaraan"}
        </Button>
      </form>
    </Form>
  )
}
