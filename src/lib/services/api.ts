type RequestOptions = {
  method?: string
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(path, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Request failed")
  }

  return json.data as T
}

export const api = {
  // Vehicles
  getVehicles: () => request<any[]>("/api/vehicles"),
  getVehicle: (id: string) => request<any>(`/api/vehicles/${id}`),
  createVehicle: (data: any) => request<any>("/api/vehicles", { method: "POST", body: data }),
  updateVehicle: (id: string, data: any) => request<any>(`/api/vehicles/${id}`, { method: "PATCH", body: data }),
  deleteVehicle: (id: string) => request<{ id: string }>(`/api/vehicles/${id}`, { method: "DELETE" }),

  // Odometer
  getOdometerReadings: (vehicleId: string) => request<any[]>(`/api/odometer?vehicleId=${vehicleId}`),
  createOdometerReading: (data: any) => request<any>("/api/odometer", { method: "POST", body: data }),
  deleteOdometerReading: (id: string) => request<{ id: string }>(`/api/odometer/${id}`, { method: "DELETE" }),

  // Fuel
  getFuelLogs: (vehicleId?: string) => request<any[]>(`/api/fuel${vehicleId ? `?vehicleId=${vehicleId}` : ""}`),
  createFuelLog: (data: any) => request<any>("/api/fuel", { method: "POST", body: data }),
  deleteFuelLog: (id: string) => request<{ id: string }>(`/api/fuel/${id}`, { method: "DELETE" }),

  // Components
  getComponents: (vehicleId: string) => request<any[]>(`/api/components?vehicleId=${vehicleId}`),
  createComponent: (data: any) => request<any>("/api/components", { method: "POST", body: data }),

  // Maintenance
  getMaintenanceRecords: (vehicleId?: string) =>
    request<any[]>(`/api/maintenance${vehicleId ? `?vehicleId=${vehicleId}` : ""}`),
  createMaintenanceRecord: (data: any) => request<any>("/api/maintenance", { method: "POST", body: data }),
  deleteMaintenanceRecord: (id: string) => request<{ id: string }>(`/api/maintenance/${id}`, { method: "DELETE" }),

  // Health
  getVehicleHealth: (vehicleId: string) => request<any>(`/api/health?vehicleId=${vehicleId}`),

  // Notifications
  getNotifications: () => request<any[]>("/api/notifications"),
}
