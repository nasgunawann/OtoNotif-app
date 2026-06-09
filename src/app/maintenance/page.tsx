"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconAlertCircle, IconCircleCheck, IconTool, IconInfoCircle } from "@tabler/icons-react"
import { motion } from "motion/react"
import { api } from "@/lib/services/api"
import type { Vehicle, VehicleHealth, ComponentHealth } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/forms/FormDialog"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { ComponentDetailSheet } from "@/components/layout/ComponentDetailSheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function MaintenancePage() {
  const [healthData, setHealthData] = useState<VehicleHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all")
  const [detailComponent, setDetailComponent] = useState<{
    data: ComponentHealth
    vehicleId: string
    vehicleName: string
    vehicleType: "motor" | "mobil"
  } | null>(null)

  useEffect(() => {
    api.getVehicles().then((vehicles) =>
      Promise.all(
        vehicles.map((v: Vehicle) => api.getVehicleHealth(v.id))
      )
    ).then((health) => {
      setHealthData(health)
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const allComponents = healthData.flatMap((h) =>
    h.components.map((c) => ({
      ...c,
      vehicleId: h.vehicle.id,
      vehicleName: h.vehicle.name,
      vehicleType: h.vehicle.type,
    }))
  )
  const filteredComponents = allComponents.filter(
    (c) => selectedVehicleId === "all" || c.vehicleId === selectedVehicleId
  )
  const dueItems = filteredComponents.filter((c) => c.status === "danger" || c.status === "warning")
  const safeItems = filteredComponents.filter((c) => c.status === "safe")

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold tracking-tight">Perawatan</h1>
          <p className="text-muted-foreground">Jadwal perawatan kendaraan Anda.</p>
        </div>
        {healthData.length > 0 && (
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-full sm:w-[220px] h-10 rounded-full bg-card/50">
              <SelectValue placeholder="Semua Kendaraan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kendaraan</SelectItem>
              {healthData.map((h) => (
                <SelectItem key={h.vehicle.id} value={h.vehicle.id}>
                  {h.vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mt-8">Segera Lakukan</h2>
          {dueItems.length === 0 ? (
            <Card className="p-8 text-center border-green-500/20 bg-green-500/5">
              <IconCircleCheck className="h-10 w-10 mx-auto text-green-500 mb-3" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Semua komponen dalam kondisi baik.</p>
            </Card>
          ) : (
            dueItems.map((item) => (
              <Card
                key={`${item.component.id}`}
                className={cn(
                  "border-solid",
                  item.status === 'danger'
                    ? "border-orange-500/50 bg-orange-500/5 dark:bg-orange-500/10"
                    : "border-yellow-500/50 bg-yellow-500/5 dark:bg-yellow-500/10"
                )}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <IconAlertCircle
                    className={cn(
                      "h-5 w-5 mr-2",
                      item.status === 'danger' ? "text-orange-500" : "text-yellow-500"
                    )}
                  />
                  <CardTitle
                    className={cn(
                      "text-base font-bold flex-1",
                      item.status === 'danger'
                        ? "text-orange-700 dark:text-orange-400"
                        : "text-yellow-700 dark:text-yellow-400"
                    )}
                  >
                    Ganti {item.component.name} - {item.vehicleName}
                  </CardTitle>
                  <button
                    type="button"
                    className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={() => setDetailComponent({
                      data: item,
                      vehicleId: item.vehicleId,
                      vehicleName: item.vehicleName,
                      vehicleType: (item as typeof item & { vehicleType: "motor" | "mobil" }).vehicleType,
                    })}
                    aria-label="Detail komponen"
                  >
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground/50 hover:text-foreground" />
                  </button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.status === "danger"
                      ? `Sudah melebihi batas interval ${item.component.intervalKm} km.`
                      : `Mendekati batas interval. Sisa ${item.remainingKm} km lagi.`}
                  </p>
                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-muted-foreground">Interval</span>
                    <span className="font-medium text-foreground">{item.component.intervalKm.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Terpakai</span>
                    <span className="font-medium text-foreground">{item.usedKm.toLocaleString()} km</span>
                  </div>

                  <div className="flex justify-end mt-4 pt-2 border-t border-border/20">
                    <FormDialog
                      title="Tambah Servis"
                      description={`Servis komponen ${item.component.name} untuk ${item.vehicleName}`}
                      trigger={
                        <Button size="sm" className="h-8 text-xs font-bold gap-1 rounded-full">
                          <IconTool className="h-3.5 w-3.5" /> Servis Sekarang
                        </Button>
                      }
                    >
                      <ServiceForm
                        vehicleId={item.vehicleId}
                        vehicleName={item.vehicleName}
                        defaultComponentId={item.component.id}
                        defaultDescription={`Ganti ${item.component.name}`}
                        onSuccess={() => {
                          setHealthData([])
                          setLoading(true)
                          api.getVehicles().then((vehicles) =>
                            Promise.all(
                              vehicles.map((v: Vehicle) => api.getVehicleHealth(v.id))
                            )
                          ).then((health) => {
                            setHealthData(health)
                          }).catch((e) => {
                            console.error(e)
                          }).finally(() => {
                            setLoading(false)
                          })
                        }}
                      />
                    </FormDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <h2 className="text-xl font-semibold mt-8">Aman (Dalam Batas Normal)</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {safeItems.length === 0 ? (
              <div className="col-span-2 text-center text-sm text-muted-foreground p-8">
                Belum ada komponen yang dipantau.
              </div>
            ) : (
              safeItems.map((item) => (
                <Card key={item.component.id}>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2 p-3">
                    <IconCircleCheck className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                    <CardTitle className="text-xs font-bold truncate">{item.component.name} - {item.vehicleName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-[10px] text-muted-foreground">Aman ({item.remainingKm.toLocaleString()} km lagi).</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {detailComponent && (
        <ComponentDetailSheet
          data={detailComponent.data}
          vehicleId={detailComponent.vehicleId}
          vehicleName={detailComponent.vehicleName}
          vehicleType={detailComponent.vehicleType}
          open={!!detailComponent}
          onOpenChange={(open) => { if (!open) setDetailComponent(null) }}
          onDeleted={() => {
            api.getVehicles().then((vehicles) =>
              Promise.all(
                vehicles.map((v: Vehicle) => api.getVehicleHealth(v.id))
              )
            ).then((health) => {
              setHealthData(health)
            }).catch((e) => {
              console.error(e)
            })
          }}
        />
      )}
    </motion.div>
  )
}
