export type VehicleType = "motor" | "mobil"

export interface Vehicle {
  id: string
  name: string
  type: VehicleType
  image: string
  engine: string
  fuelCapacity: number
  isPrimary: boolean
  createdAt: string
  updatedAt: string
  latestOdo?: number | null
  latestOdoDate?: string | null
}

export interface OdometerReading {
  id: string
  vehicleId: string
  reading: number
  date: string
  notes: string
  createdAt: string
}

export interface FuelLog {
  id: string
  vehicleId: string
  date: string
  liters: number
  amount: number
  fuelType: string
  odoReading: number
  notes: string
  createdAt: string
}

export interface Component {
  id: string
  vehicleId: string
  name: string
  intervalKm: number
  lastReplacedOdo: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  componentId: string | null
  date: string
  description: string
  cost: number
  odoReading: number
  notes: string
  createdAt: string
}

export interface ComponentHealth {
  component: Component
  currentOdo: number
  usedKm: number
  remainingKm: number
  usagePercent: number
  status: "safe" | "warning" | "danger"
}

export interface VehicleHealth {
  vehicle: Vehicle
  latestOdo: number | null
  health: number
  components: ComponentHealth[]
  lastUpdate: string | null
  fuel?: {
    current: number
    max: number
    percent: number
    avg: string
    latestFuelLog: FuelLog | null
  } | null
  monthlyCost?: number
  weeklyOdoDelta?: number
  latestFuelLog?: FuelLog | null
}

export type Notification = {
  id: string
  title: string
  description: string
  time: string
  type: "warning" | "danger" | "success"
  icon: string
}

// API types
export type ApiResponse<T> = {
  data: T
} | {
  error: string
}

export interface CreateVehicleInput {
  name: string
  type: VehicleType
  image?: string
  engine?: string
  fuelCapacity?: number
  isPrimary?: boolean
}

export interface CreateOdometerInput {
  vehicleId: string
  reading: number
  date: string
  notes?: string
}

export interface CreateFuelLogInput {
  vehicleId: string
  date: string
  liters: number
  amount: number
  fuelType: string
  odoReading?: number
  notes?: string
}

export interface CreateComponentInput {
  vehicleId: string
  name: string
  intervalKm: number
  lastReplacedOdo?: number
  notes?: string
}

export interface CreateMaintenanceInput {
  vehicleId: string
  componentId?: string
  date: string
  description: string
  cost?: number
  odoReading?: number
  notes?: string
}
