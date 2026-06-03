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
    const vehicle = await api.createVehicle(data)
    set((state) => ({ vehicles: [...state.vehicles, vehicle] }))
    return vehicle
  },

  deleteVehicle: async (id: string) => {
    await api.deleteVehicle(id)
    set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) }))
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
    const reading = await api.createOdometerReading(data)
    set((state) => ({ odometerReadings: [reading, ...state.odometerReadings] }))
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
    const log = await api.createFuelLog(data)
    set((state) => ({ fuelLogs: [log, ...state.fuelLogs] }))
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
    const component = await api.createComponent(data)
    set((state) => ({ components: [...state.components, component] }))
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
    const record = await api.createMaintenanceRecord(data)
    set((state) => ({ maintenanceRecords: [record, ...state.maintenanceRecords] }))
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
