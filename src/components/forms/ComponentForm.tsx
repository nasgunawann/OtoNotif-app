"use client"

import { useState } from "react"
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
import { IconLoader2 } from "@tabler/icons-react"
import { COMPONENT_TEMPLATES } from "@/lib/component-templates"

const formSchema = z.object({
  name: z.string().min(1, "Nama komponen harus diisi"),
  intervalKm: z.coerce.number().int().min(1, "Interval km harus diisi"),
  lastReplacedOdo: z.coerce.number().int().min(0, "Odometer tidak boleh negatif").optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  vehicleId: string
  vehicleType?: "motor" | "mobil"
  onSuccess?: () => void
}

export function ComponentForm({ vehicleId, vehicleType = "motor", onSuccess }: Props) {
  const { createComponent, vehicleHealth } = useVehicleStore()
  const [useCustomName, setUseCustomName] = useState(false)
  const currentOdo = vehicleHealth?.latestOdo ?? 0

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      intervalKm: 5000,
      lastReplacedOdo: currentOdo,
    },
  })

  const selectedInterval = form.watch("intervalKm")

  function handleTemplateSelect(name: string) {
    if (name === "__custom__") {
      setUseCustomName(true)
      form.setValue("name", "")
      return
    }
    setUseCustomName(false)
    form.setValue("name", name)

    for (const t of COMPONENT_TEMPLATES[vehicleType]) {
      if (t.name === name) {
        form.setValue("intervalKm", t.intervalKm)
        break
      }
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      await createComponent({
        vehicleId,
        name: values.name,
        intervalKm: values.intervalKm,
        lastReplacedOdo: values.lastReplacedOdo || 0,
      })
      toast.success("Komponen berhasil ditambahkan")
      form.reset()
      setUseCustomName(false)
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
              {!useCustomName ? (
                <Select onValueChange={handleTemplateSelect} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih atau ketik manual" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMPONENT_TEMPLATES[vehicleType].map((t) => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">Lainnya (isi manual)...</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <Input placeholder="Nama komponen" {...field} />
                </FormControl>
              )}
              {!useCustomName && (
                <p className="text-[10px] text-muted-foreground">
                  Pilih dari daftar umum, atau pilih &quot;Lainnya&quot; untuk custom
                </p>
              )}
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
              <p className="text-[10px] text-muted-foreground">
                {selectedInterval
                  ? `Ganti setiap ${selectedInterval.toLocaleString("id-ID")} km`
                  : "Contoh: Oli motor ~3.000 km, ban ~20.000 km"}
              </p>
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
              <p className="text-[10px] text-muted-foreground">
                Odometer saat ini: {currentOdo.toLocaleString("id-ID")} km
                {currentOdo > 0 && " — biarkan 0 jika baru pertama kali"}
              </p>
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
