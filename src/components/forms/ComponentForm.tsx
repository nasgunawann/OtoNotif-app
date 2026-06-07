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
  name: z.string().min(1, "Nama komponen harus diisi"),
  intervalKm: z.coerce.number().int().min(1, "Interval km harus diisi"),
  lastReplacedOdo: z.coerce.number().int().min(0, "Odometer tidak boleh negatif").optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  onSuccess?: () => void
}

export function ComponentForm({ vehicleId, onSuccess }: Props) {
  const { createComponent } = useVehicleStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      intervalKm: 5000,
      lastReplacedOdo: 0,
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await createComponent({
        vehicleId,
        ...values,
      })
      toast.success("Komponen berhasil ditambahkan")
      form.reset()
      onSuccess?.()
    } catch {
      toast.error("Gagal menambahkan komponen")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 md:py-0">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Komponen</FormLabel>
              <FormControl>
                <Input placeholder="Oli Mesin, Aki, Ban Depan, dll" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="intervalKm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval Penggantian (KM)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastReplacedOdo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odometer Terakhir Diganti (KM)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
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
                <Input placeholder="Merk, spesifikasi, dll" {...field} />
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
            "Tambah Komponen"
          )}
        </Button>
      </form>
    </Form>
  )
}
