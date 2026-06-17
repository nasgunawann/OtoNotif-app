"use client"

import { useForm, useWatch } from "react-hook-form"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"
import { IconLoader2 } from "@tabler/icons-react"
import type { Vehicle } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(1, "Nama kendaraan harus diisi"),
  type: z.enum(["motor", "mobil"]),
  engine: z.coerce.number().optional(),
  fuelCapacity: z.coerce.number().optional(),
  image: z.string().optional(),
  taxDueDate: z.string().optional(),
  taxReminderDays: z.coerce.number().optional(),
  taxIntervalYears: z.coerce.number().optional(),
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
      engine: vehicle?.engine || undefined as unknown as number,
      fuelCapacity: vehicle?.fuelCapacity || undefined as unknown as number,
      image: vehicle?.image || "",
      taxDueDate: vehicle?.taxDueDate || "",
      taxReminderDays: vehicle?.taxReminderDays ?? 30,
      taxIntervalYears: vehicle?.taxIntervalYears ?? 1,
      taxAmount: vehicle?.taxAmount || undefined as unknown as number,
    },
  })

  const imageVal = useWatch({
    control: form.control,
    name: "image",
  })

  async function onSubmit(values: FormValues) {
    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, {
          name: values.name,
          type: values.type,
          engine: values.engine || 0,
          fuelCapacity: values.fuelCapacity || 0,
          image: values.image || vehicle.image,
          taxDueDate: values.taxDueDate || null,
          taxReminderDays: values.taxReminderDays ?? 30,
          taxIntervalYears: values.taxIntervalYears ?? 1,
          taxAmount: values.taxAmount ?? 0,
        })
        toast.success(`Kendaraan ${values.name} diperbarui`)
      } else {
        await createVehicle({
          name: values.name,
          type: values.type,
          engine: values.engine || 0,
          fuelCapacity: values.fuelCapacity || 0,
          image: values.image || (values.type === "motor" ? "/motorcycle_supra_mockup.png" : "/car_civic_mockup.png"),
          taxDueDate: values.taxDueDate || undefined,
          taxReminderDays: values.taxReminderDays ?? 30,
          taxIntervalYears: values.taxIntervalYears ?? 1,
          taxAmount: values.taxAmount ?? 0,
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
          name="image"
          render={() => (
            <FormItem className="flex flex-col items-center gap-2 py-2">
              <FormLabel className="self-start">Foto Kendaraan (opsional)</FormLabel>
              <div 
                className="relative h-28 w-28 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer overflow-hidden flex items-center justify-center bg-muted/30 group transition-colors shadow-inner"
                onClick={() => document.getElementById("vehicle-image-upload")?.click()}
              >
                {imageVal ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageVal}
                    alt="Preview Kendaraan"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-[10px] font-bold block">Pilih Foto</span>
                    <span className="text-[8px] text-muted-foreground/60 block mt-0.5">Rasio 1:1</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] text-white font-bold">Ubah Foto</span>
                </div>
              </div>
              <input
                id="vehicle-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error("Ukuran file maksimal 2MB")
                    return
                  }
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                      form.setValue("image", reader.result)
                    }
                  }
                  reader.readAsDataURL(file)
                }}
              />
              {imageVal && (
                <Button
                  type="button"
                  variant="link"
                  className="text-xs text-red-500 h-auto p-0"
                  onClick={() => form.setValue("image", "")}
                >
                  Hapus Foto
                </Button>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="engine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Mesin (opsional)</FormLabel>
              <FormControl>
                <InputGroup>
                  <NumberInput placeholder="125" value={field.value} onChange={field.onChange} />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>cc</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
              <FormLabel>Kapasitas BBM (opsional)</FormLabel>
              <FormControl>
                <InputGroup>
                  <NumberInput placeholder="4" value={field.value} onChange={field.onChange} />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>L</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="taxReminderDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengingat (H-)</FormLabel>
                <FormControl>
                  <InputGroup>
                    <NumberInput placeholder="30" value={field.value} onChange={field.onChange} />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxIntervalYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <InputGroup>
                    <NumberInput placeholder="1" value={field.value} onChange={field.onChange} />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>thn</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
                <FormLabel>Nominal</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>Rp</InputGroupText>
                    </InputGroupAddon>
                    <NumberInput placeholder="500.000" value={field.value} onChange={field.onChange} />
                  </InputGroup>
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
