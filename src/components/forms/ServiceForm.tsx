"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useVehicleStore } from "@/lib/store/use-vehicle-store";
import { api } from "@/lib/services/api";
import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import type { Component } from "@/lib/types";
import { COMPONENT_TEMPLATES } from "@/lib/component-templates";

const formSchema = z.object({
  componentId: z.string().optional(),
  cost: z.coerce.number().optional(),
  date: z.string().min(1, "Tanggal harus diisi"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  vehicleId: string;
  vehicleName: string;
  vehicleType?: "motor" | "mobil";
  defaultComponentId?: string;
  onSuccess?: () => void;
};

export function ServiceForm({
  vehicleId,
  vehicleName,
  vehicleType,
  defaultComponentId,
  onSuccess,
}: Props) {
  const { createMaintenanceRecord, vehicleHealth } = useVehicleStore();
  const latestOdo = vehicleHealth?.latestOdo ?? 0;
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    api
      .getComponents(vehicleId)
      .then(setComponents)
      .catch(() => {});
  }, [vehicleId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentId: defaultComponentId || "",
      cost: undefined as unknown as number,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const watchedComponentId = form.watch("componentId")

  // Auto-fill cost from template when component is selected
  useEffect(() => {
    if (!watchedComponentId) return
    const comp = components.find(c => c.id === watchedComponentId)
    if (!comp) return
    const templates = vehicleType ? COMPONENT_TEMPLATES[vehicleType] : []
    const allTemplates = [...COMPONENT_TEMPLATES.motor, ...COMPONENT_TEMPLATES.mobil]
    const t = templates.find(tmpl => tmpl.name === comp.name)
      || allTemplates.find(tmpl => tmpl.name === comp.name)
    if (t?.estimatedCost) {
      form.setValue("cost", t.estimatedCost)
    }
  }, [watchedComponentId, components, vehicleType, form])

  async function onSubmit(values: FormValues) {
    try {
      const compName = values.componentId
        ? components.find(c => c.id === values.componentId)?.name || ""
        : ""
      await createMaintenanceRecord({
        vehicleId,
        componentId: values.componentId || undefined,
        description: compName || values.notes?.slice(0, 50) || "Servis",
        cost: values.cost || 0,
        date: values.date,
        odoReading: latestOdo,
        notes: values.notes || "",
      });
      toast.success(`Servis ${vehicleName} tersimpan`);
      onSuccess?.();
    } catch {
      toast.error("Gagal menyimpan servis");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="componentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Komponen</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komponen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biaya</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>Rp</InputGroupText>
                  </InputGroupAddon>
                  <NumberInput
                    placeholder="150.000"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </InputGroup>
              </FormControl>
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
                <Textarea placeholder="Detail tambahan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base gap-2"
          disabled={form.formState.isSubmitting}
        >
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
  );
}
