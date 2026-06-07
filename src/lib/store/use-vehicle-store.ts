"use client"

import { create } from "zustand"
import { api } from "@/lib/services/api"
import type { Vehicle, OdometerReading, FuelLog, Component, MaintenanceRecord, VehicleHealth, ComponentHealth } from "@/lib/types"

interface VehicleStore {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  vehicleHealth: VehicleHealth | null
  odometerReadings: OdometerReading[]
  fuelLogs: FuelLog[]
  components: Component[]
  maintenanceRecords: MaintenanceRecord[]
  loading: boolean
  error: string | null

  fetchVehicles: () => Promise<void>
  fetchVehicle: (id: string) => Promise<void>
  createVehicle: (data: Partial<Vehicle> & { name: string; type: "motor" | "mobil" }) => Promise<Vehicle>
  deleteVehicle: (id: string) => Promise<void>

  fetchOdometerReadings: (vehicleId: string) => Promise<void>
  createOdometerReading: (data: any) => Promise<void>
  deleteOdometerReading: (id: string, vehicleId: string) => Promise<void>

  fetchFuelLogs: (vehicleId?: string) => Promise<void>
  createFuelLog: (data: any) => Promise<void>

  fetchComponents: (vehicleId: string) => Promise<void>
  createComponent: (data: any) => Promise<void>

  fetchMaintenanceRecords: (vehicleId?: string) => Promise<void>
  createMaintenanceRecord: (data: any) => Promise<void>

  fetchVehicleHealth: (vehicleId: string) => Promise<void>
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  vehicleHealth: null,
  odometerReadings: [],
  fuelLogs: [],
  components: [],
  maintenanceRecords: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    set({ loading: true })
    try {
      const vehicles = await api.getVehicles()
      set({ vehicles, loading: false, error: null })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchVehicle: async (id: string) => {
    set({ loading: true })
    try {
      const selectedVehicle = await api.getVehicle(id)
      set({ selectedVehicle, loading: false, error: null })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  createVehicle: async (data) => {
    const previousVehicles = get().vehicles
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticVehicle: Vehicle = {
      id: tempId,
      name: data.name,
      type: data.type,
      image: data.image || "",
      engine: data.engine || "",
      fuelCapacity: data.fuelCapacity ?? 0,
      isPrimary: data.isPrimary ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    set({ vehicles: [...previousVehicles, optimisticVehicle] })

    try {
      const vehicle = await api.createVehicle(data)
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === tempId ? vehicle : v)),
      }))
      return vehicle
    } catch (e) {
      set({ vehicles: previousVehicles })
      throw e
    }
  },

  deleteVehicle: async (id: string) => {
    const previousVehicles = get().vehicles
    set({ vehicles: previousVehicles.filter((v) => v.id !== id) })

    try {
      await api.deleteVehicle(id)
    } catch (e) {
      set({ vehicles: previousVehicles })
      throw e
    }
  },

  fetchOdometerReadings: async (vehicleId: string) => {
    try {
      const odometerReadings = await api.getOdometerReadings(vehicleId)
      set({ odometerReadings })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  createOdometerReading: async (data) => {
    const previousReadings = get().odometerReadings
    const previousHealth = get().vehicleHealth
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticReading: OdometerReading = {
      id: tempId,
      vehicleId: data.vehicleId,
      reading: data.reading,
      date: data.date,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    }

    set({ odometerReadings: [optimisticReading, ...previousReadings] })

    if (previousHealth && previousHealth.vehicle.id === data.vehicleId) {
      const currentOdo = previousHealth.latestOdo || 0
      if (data.reading > currentOdo) {
        set({
          vehicleHealth: {
            ...previousHealth,
            latestOdo: data.reading,
            components: previousHealth.components.map((c) => {
              const usedKm = data.reading - (c.component.lastReplacedOdo ?? 0)
              const remainingKm = Math.max(0, c.component.intervalKm - usedKm)
              const usagePercent = Math.min(100, (usedKm / c.component.intervalKm) * 100)
              const status =
                usagePercent > 85 ? ("danger" as const)
                : usagePercent > 70 ? ("warning" as const)
                : ("safe" as const)
              return { ...c, currentOdo: data.reading, usedKm, remainingKm, usagePercent, status }
            }),
          },
        })
      }
    }

    try {
      const reading = await api.createOdometerReading(data)
      set((state) => ({
        odometerReadings: state.odometerReadings.map((r) => (r.id === tempId ? reading : r)),
      }))
      get().fetchVehicleHealth(data.vehicleId)
    } catch (e) {
      set({ odometerReadings: previousReadings, vehicleHealth: previousHealth })
      throw e
    }
  },

  deleteOdometerReading: async (id: string, vehicleId: string) => {
    const previousReadings = get().odometerReadings
    const previousHealth = get().vehicleHealth

    set({
      odometerReadings: previousReadings.filter((r) => r.id !== id),
    })

    try {
      await api.deleteOdometerReading(id)
      get().fetchVehicleHealth(vehicleId)
    } catch (e) {
      set({
        odometerReadings: previousReadings,
        vehicleHealth: previousHealth,
      })
      throw e
    }
  },

  fetchFuelLogs: async (vehicleId?: string) => {
    try {
      const fuelLogs = await api.getFuelLogs(vehicleId)
      set({ fuelLogs })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  createFuelLog: async (data) => {
    const previousLogs = get().fuelLogs
    const previousHealth = get().vehicleHealth
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticLog: FuelLog = {
      id: tempId,
      vehicleId: data.vehicleId,
      date: data.date,
      liters: data.liters,
      amount: data.amount,
      fuelType: data.fuelType,
      odoReading: data.odoReading ?? 0,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    }

    set({ fuelLogs: [optimisticLog, ...previousLogs] })

    if (data.odoReading && previousHealth && previousHealth.vehicle.id === data.vehicleId) {
      const currentOdo = previousHealth.latestOdo || 0
      if (data.odoReading > currentOdo) {
        set({
          vehicleHealth: {
            ...previousHealth,
            latestOdo: data.odoReading,
            components: previousHealth.components.map((c) => {
              const usedKm = data.odoReading - (c.component.lastReplacedOdo ?? 0)
              const remainingKm = Math.max(0, c.component.intervalKm - usedKm)
              const usagePercent = Math.min(100, (usedKm / c.component.intervalKm) * 100)
              const status =
                usagePercent > 85 ? ("danger" as const)
                : usagePercent > 70 ? ("warning" as const)
                : ("safe" as const)
              return { ...c, currentOdo: data.odoReading, usedKm, remainingKm, usagePercent, status }
            }),
          },
        })
      }
    }

    try {
      const log = await api.createFuelLog(data)
      set((state) => ({
        fuelLogs: state.fuelLogs.map((l) => (l.id === tempId ? log : l)),
      }))
      get().fetchVehicleHealth(data.vehicleId)
    } catch (e) {
      set({ fuelLogs: previousLogs, vehicleHealth: previousHealth })
      throw e
    }
  },

  fetchComponents: async (vehicleId: string) => {
    try {
      const components = await api.getComponents(vehicleId)
      set({ components })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  createComponent: async (data) => {
    const previousComponents = get().components
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticComponent: Component = {
      id: tempId,
      vehicleId: data.vehicleId,
      name: data.name,
      intervalKm: data.intervalKm,
      lastReplacedOdo: data.lastReplacedOdo ?? 0,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    set({ components: [...previousComponents, optimisticComponent] })

    try {
      const component = await api.createComponent(data)
      set((state) => ({
        components: state.components.map((c) => (c.id === tempId ? component : c)),
      }))
      get().fetchVehicleHealth(data.vehicleId)
    } catch (e) {
      set({ components: previousComponents })
      throw e
    }
  },

  fetchMaintenanceRecords: async (vehicleId?: string) => {
    try {
      const maintenanceRecords = await api.getMaintenanceRecords(vehicleId)
      set({ maintenanceRecords })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  createMaintenanceRecord: async (data) => {
    const previousRecords = get().maintenanceRecords
    const previousHealth = get().vehicleHealth
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticRecord: MaintenanceRecord = {
      id: tempId,
      vehicleId: data.vehicleId,
      componentId: data.componentId ?? null,
      date: data.date,
      description: data.description,
      cost: data.cost ?? 0,
      odoReading: data.odoReading ?? 0,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    }

    set({ maintenanceRecords: [optimisticRecord, ...previousRecords] })

    if (data.componentId && previousHealth && previousHealth.vehicle.id === data.vehicleId) {
      const currentOdo = data.odoReading || previousHealth.latestOdo || 0
      set({
        vehicleHealth: {
          ...previousHealth,
          latestOdo: Math.max(previousHealth.latestOdo || 0, currentOdo),
          components: previousHealth.components.map((c) => {
            if (c.component.id === data.componentId) {
              const updatedComp = { ...c.component, lastReplacedOdo: currentOdo }
              return {
                component: updatedComp,
                currentOdo,
                usedKm: 0,
                remainingKm: c.component.intervalKm,
                usagePercent: 0,
                status: "safe" as const,
              }
            }
            return c
          }),
        },
      })
    }

    try {
      const record = await api.createMaintenanceRecord(data)
      set((state) => ({
        maintenanceRecords: state.maintenanceRecords.map((r) => (r.id === tempId ? record : r)),
      }))
      get().fetchVehicleHealth(data.vehicleId)
    } catch (e) {
      set({ maintenanceRecords: previousRecords, vehicleHealth: previousHealth })
      throw e
    }
  },

  fetchVehicleHealth: async (vehicleId: string) => {
    try {
      const vehicleHealth = await api.getVehicleHealth(vehicleId)
      set({ vehicleHealth })
    } catch (e: any) {
      set({ error: e.message })
    }
  },
}))
