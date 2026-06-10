type RequestOptions = {
  method?: string
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(path, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Request failed")
  }

  return json.data as T
}

import type {
  Vehicle,
  OdometerReading,
  FuelLog,
  Component,
  MaintenanceRecord,
  VehicleHealth,
  Notification,
  CreateVehicleInput,
  CreateOdometerInput,
  CreateFuelLogInput,
  CreateComponentInput,
  CreateMaintenanceInput,
} from "@/lib/types"

export const api = {
  // Vehicles
  getVehicles: () => request<Vehicle[]>("/api/vehicles"),
  getVehicle: (id: string) => request<Vehicle>(`/api/vehicles/${id}`),
  createVehicle: (data: CreateVehicleInput) => request<Vehicle>("/api/vehicles", { method: "POST", body: data }),
  updateVehicle: (id: string, data: Partial<Vehicle>) => request<Vehicle>(`/api/vehicles/${id}`, { method: "PATCH", body: data }),
  deleteVehicle: (id: string) => request<{ id: string }>(`/api/vehicles/${id}`, { method: "DELETE" }),

  // Odometer
  getOdometerReadings: (vehicleId: string) => request<OdometerReading[]>(`/api/odometer?vehicleId=${vehicleId}`),
  createOdometerReading: (data: CreateOdometerInput) => request<OdometerReading>("/api/odometer", { method: "POST", body: data }),
  deleteOdometerReading: (id: string) => request<{ id: string }>(`/api/odometer/${id}`, { method: "DELETE" }),

  // Fuel
  getFuelLogs: (vehicleId?: string) => request<FuelLog[]>(`/api/fuel${vehicleId ? `?vehicleId=${vehicleId}` : ""}`),
  createFuelLog: (data: CreateFuelLogInput) => request<FuelLog>("/api/fuel", { method: "POST", body: data }),
  deleteFuelLog: (id: string) => request<{ id: string }>(`/api/fuel/${id}`, { method: "DELETE" }),

  // Components
  getComponents: (vehicleId: string) => request<Component[]>(`/api/components?vehicleId=${vehicleId}`),
  createComponent: (data: CreateComponentInput) => request<Component>("/api/components", { method: "POST", body: data }),
  deleteComponent: (id: string) => request<{ id: string }>(`/api/components/${id}`, { method: "DELETE" }),

  // Maintenance
  getMaintenanceRecords: (vehicleId?: string) =>
    request<MaintenanceRecord[]>(`/api/maintenance${vehicleId ? `?vehicleId=${vehicleId}` : ""}`),
  createMaintenanceRecord: (data: CreateMaintenanceInput) => request<MaintenanceRecord>("/api/maintenance", { method: "POST", body: data }),
  deleteMaintenanceRecord: (id: string) => request<{ id: string }>(`/api/maintenance/${id}`, { method: "DELETE" }),

  // Health
  getVehicleHealth: (vehicleId: string) => request<VehicleHealth>(`/api/health?vehicleId=${vehicleId}`),

  // Notifications
  getNotifications: () => request<Notification[]>("/api/notifications"),
}
