"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { toast } from "sonner";
import { useVehicleStore } from "@/lib/store/use-vehicle-store";
import { IconLoader2, IconHelpCircle, IconGauge } from "@tabler/icons-react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  reading: z.coerce.number().int().min(1, "Odometer harus diisi"),
  estimatedKm: z.coerce.number().int().min(1, "Perkiraan jarak harus diisi").optional(),
  date: z.string().min(1, "Tanggal harus diisi"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  vehicleId: string;
  vehicleName: string;
  onSuccess?: () => void;
};

export function OdometerForm({ vehicleId, vehicleName, onSuccess }: Props) {
  const { createOdometerReading, vehicleHealth } = useVehicleStore();
  const latestOdo = vehicleHealth?.latestOdo ?? 0;
  const [mode, setMode] = useState<"odo" | "estimated">("odo");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reading: undefined as unknown as number,
      estimatedKm: undefined as unknown as number,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const estimatedReading = useWatch({ control: form.control, name: "estimatedKm" });
  const computedOdo = latestOdo > 0 && estimatedReading ? latestOdo + estimatedReading : null;

  async function onSubmit(values: FormValues) {
    let finalReading = values.reading;

    if (mode === "estimated") {
      if (!values.estimatedKm || values.estimatedKm < 1) {
        form.setError("estimatedKm", { type: "manual", message: "Isi perkiraan jarak" });
        return;
      }
      if (latestOdo === 0) {
        form.setError("estimatedKm", {
          type: "manual",
          message: "Belum ada odometer awal. Gunakan mode manual atau update odometer dulu.",
        });
        return;
      }
      finalReading = latestOdo + values.estimatedKm;
    } else {
      if (latestOdo > 0 && values.reading <= latestOdo) {
        form.setError("reading", {
          type: "manual",
          message: `Odometer baru harus lebih besar dari saat ini (${latestOdo.toLocaleString()} km)`,
        });
        return;
      }
    }

    try {
      await createOdometerReading({
        vehicleId,
        reading: finalReading,
        date: values.date,
        notes: values.notes || "",
      });
      toast.success(`Odometer ${vehicleName} diperbarui`);
      form.reset();
      setMode("odo");
      onSuccess?.();
    } catch {
      toast.error("Gagal menyimpan odometer");
    }
  }

  const displayOdo = latestOdo > 0 ? latestOdo.toLocaleString("id-ID") : "—";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border/50 p-0.5 bg-muted/30">
          <button
            type="button"
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              mode === "odo" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setMode("odo")}
          >
            <IconGauge className="h-3.5 w-3.5 inline mr-1" />
            Odometer
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              mode === "estimated" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setMode("estimated")}
          >
            <IconHelpCircle className="h-3.5 w-3.5 inline mr-1" />
            Perkiraan
          </button>
        </div>

        {mode === "odo" ? (
          <FormField
            control={form.control}
            name="reading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer</FormLabel>
                <FormControl>
                  <InputGroup>
                    <NumberInput placeholder="0" value={field.value} onChange={field.onChange} />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>km</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <p className="text-[10px] text-muted-foreground">
                  Odometer saat ini: <span className="font-semibold text-foreground">{displayOdo}</span> km
                  {latestOdo > 0 && " — isi angka yang lebih besar"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="estimatedKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perkiraan Jarak Tempuh</FormLabel>
                <FormControl>
                  <InputGroup>
                    <NumberInput placeholder="0" value={field.value} onChange={field.onChange} />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>km</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <p className="text-[10px] text-muted-foreground">
                  Perkiraan km yang sudah ditempuh sejak odometer{" "}
                  <span className="font-semibold text-foreground">{displayOdo}</span> km
                </p>
                {computedOdo !== null && computedOdo > 0 && (
                  <p className="text-[10px] font-semibold text-primary">
                    Odometer akan tercatat: {computedOdo.toLocaleString("id-ID")} km
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                <Textarea placeholder="Dari rumah ke kantor, dll..." {...field} />
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
