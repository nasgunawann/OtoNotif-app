"use client"

import { useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { api } from "@/lib/services/api"
import { IconLoader2 } from "@tabler/icons-react"
import { useState } from "react"
import type { Component } from "@/lib/types"

const formSchema = z.object({
  componentId: z.string().optional(),
  description: z.string().min(1, "Deskripsi harus diisi"),
  cost: z.coerce.number().optional(),
  date: z.string().min(1, "Tanggal harus diisi"),
  odoReading: z.coerce.number().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  vehicleName: string
  defaultComponentId?: string
  defaultDescription?: string
  onSuccess?: () => void
}

export function ServiceForm({ vehicleId, vehicleName, defaultComponentId, defaultDescription, onSuccess }: Props) {
  const { createMaintenanceRecord, vehicleHealth } = useVehicleStore()
  const latestOdo = vehicleHealth?.latestOdo ?? 0
  const [components, setComponents] = useState<Component[]>([])

  useEffect(() => {
    api.getComponents(vehicleId).then(setComponents).catch(() => {})
  }, [vehicleId])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentId: defaultComponentId || "",
      description: defaultDescription || "",
      cost: undefined as unknown as number,
      date: new Date().toISOString().split("T")[0],
      odoReading: undefined,
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await createMaintenanceRecord({
        vehicleId,
        componentId: values.componentId || undefined,
        description: values.description,
        cost: values.cost || 0,
        date: values.date,
        odoReading: values.odoReading || 0,
        notes: values.notes || "",
      })
      toast.success(`Servis ${vehicleName} tersimpan`)
      onSuccess?.()
    } catch {
      toast.error("Gagal menyimpan servis")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Servis</FormLabel>
              <FormControl>
                <Input placeholder="Ganti Oli Mesin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="componentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Komponen (opsional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komponen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biaya (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="150000" {...field} />
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
                <FormLabel>Odometer</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12.500" {...field} />
                </FormControl>
                <p className="text-[10px] text-muted-foreground">
                  Odometer saat ini: <span className="font-semibold text-foreground">{latestOdo > 0 ? latestOdo.toLocaleString("id-ID") : "—"}</span> km
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                <Textarea placeholder="Detail tambahan..." {...field} />
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
