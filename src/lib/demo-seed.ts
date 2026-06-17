import type { Vehicle, OdometerReading, FuelLog, Component, MaintenanceRecord } from "@/lib/types"

const now = new Date().toISOString()

const today = () => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function getDemoSeedData(): {
  vehicles: Vehicle[]
  odometerReadings: OdometerReading[]
  fuelLogs: FuelLog[]
  components: Component[]
  maintenanceRecords: MaintenanceRecord[]
} {
  const motorId = crypto.randomUUID()
  const mobilId = crypto.randomUUID()

  const oneMonthAgo = () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 10)
  }
  const twoMonthsAgo = () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 2)
    return d.toISOString().slice(0, 10)
  }

  const taxDueWarning = () => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().slice(0, 10)
  }

  const taxDueSafe = () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  }

  const vehicles: Vehicle[] = [
    { id: motorId, name: "Supra Bapak", type: "motor", image: "/motorcycle_supra_mockup.png", engine: 125, fuelCapacity: 4, isPrimary: true, taxDueDate: taxDueWarning(), taxReminderDays: 30, taxIntervalYears: 1, taxAmount: 150000, lastTaxPaidDate: twoMonthsAgo(), createdAt: now, updatedAt: now },
    { id: mobilId, name: "Civic Turbo", type: "mobil", image: "/car_civic_mockup.png", engine: 1500, fuelCapacity: 47, isPrimary: false, taxDueDate: taxDueSafe(), taxReminderDays: 30, taxIntervalYears: 1, taxAmount: 1500000, lastTaxPaidDate: null, createdAt: now, updatedAt: now },
  ]

  const odometerReadings: OdometerReading[] = [
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 12500, date: twoMonthsAgo(), notes: "Servis rutin", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 13100, date: oneMonthAgo(), notes: "Cek harian", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 13600, date: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10) })(), notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 14000, date: today(), notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, reading: 45200, date: twoMonthsAgo(), notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, reading: 45800, date: oneMonthAgo(), notes: "Perjalanan luar kota", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, reading: 46200, date: today(), notes: "", createdAt: now },
  ]

  const components: Component[] = [
    // Motor - oli sudah mendekati danger (2000 km interval, 14000 - 12500 = 1500 km used = 75%)
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Oli Mesin", intervalKm: 2000, lastReplacedOdo: 12500, notes: "Ganti setiap 2000 km", createdAt: now, updatedAt: now },
    // V-Belt - masih safe (10000 km interval, 14000 - 6000 = 8000 used = 80% - near warning)
    { id: crypto.randomUUID(), vehicleId: motorId, name: "V-Belt", intervalKm: 10000, lastReplacedOdo: 6000, notes: "", createdAt: now, updatedAt: now },
    // Ban - sudah warning (15000 km interval, 14000 - 2000 = 12000 used = 80%)
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Ban Belakang", intervalKm: 15000, lastReplacedOdo: 2000, notes: "", createdAt: now, updatedAt: now },
    // Filter udara - safe (5000 km interval, 14000 - 11000 = 3000 used = 60%)
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Filter Udara", intervalKm: 5000, lastReplacedOdo: 11000, notes: "", createdAt: now, updatedAt: now },
    // Mobil - oli safe (5000 km interval, 46200 - 43000 = 3200 = 64%)
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Oli Mesin", intervalKm: 5000, lastReplacedOdo: 43000, notes: "", createdAt: now, updatedAt: now },
    // Filter udara warning (10000 km interval, 46200 - 38000 = 8200 = 82%)
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Filter Udara", intervalKm: 10000, lastReplacedOdo: 38000, notes: "", createdAt: now, updatedAt: now },
    // Busi - danger (15000 km interval, 46200 - 32000 = 14200 = 94%)
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Busi", intervalKm: 15000, lastReplacedOdo: 32000, notes: "", createdAt: now, updatedAt: now },
  ]

  const fuelLogs: FuelLog[] = [
    { id: crypto.randomUUID(), vehicleId: motorId, date: oneMonthAgo(), liters: 3.5, amount: 35000, fuelType: "Pertalite", odoReading: 13100, isFull: true, kmPerLiter: null, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, date: (() => { const d = new Date(); d.setDate(d.getDate() - 10); return d.toISOString().slice(0, 10) })(), liters: 3.8, amount: 38000, fuelType: "Pertalite", odoReading: 13600, isFull: true, kmPerLiter: null, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, date: today(), liters: 4, amount: 40000, fuelType: "Pertalite", odoReading: 14000, isFull: true, kmPerLiter: 48.5, notes: "Full tank", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, date: twoMonthsAgo(), liters: 25, amount: 300000, fuelType: "Pertamax", odoReading: 45200, isFull: false, kmPerLiter: null, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, date: oneMonthAgo(), liters: 30, amount: 360000, fuelType: "Pertamax", odoReading: 45800, isFull: true, kmPerLiter: 12.0, notes: "Full tank", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, date: today(), liters: 22, amount: 264000, fuelType: "Pertamax", odoReading: 46200, isFull: false, kmPerLiter: null, notes: "", createdAt: now },
  ]

  const maintenanceRecords: MaintenanceRecord[] = [
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: components[0].id, date: twoMonthsAgo(), description: "Ganti Oli Mesin", cost: 50000, odoReading: 12500, notes: "Oli Enduro 10W-40", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: components[1].id, date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d.toISOString().slice(0, 10) })(), description: "Ganti V-Belt", cost: 150000, odoReading: 6000, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: components[2].id, date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 2); return d.toISOString().slice(0, 10) })(), description: "Ganti Ban Belakang", cost: 350000, odoReading: 2000, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: components[3].id, date: oneMonthAgo(), description: "Ganti Filter Udara", cost: 25000, odoReading: 13100, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: null, date: (() => { const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10) })(), description: "Servis Ringan", cost: 75000, odoReading: 13800, notes: "Setel rantai + bersihkan karburator", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, componentId: components[4].id, date: twoMonthsAgo(), description: "Ganti Oli + Filter", cost: 500000, odoReading: 43000, notes: "Oli Castrol 5W-30", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, componentId: components[5].id, date: (() => { const d = new Date(); d.setMonth(d.getMonth() - 4); return d.toISOString().slice(0, 10) })(), description: "Ganti Filter Udara", cost: 150000, odoReading: 38000, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, componentId: null, date: (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10) })(), description: "Rotasi Ban", cost: 50000, odoReading: 40000, notes: "", createdAt: now },
  ]

  return { vehicles, odometerReadings, fuelLogs, components, maintenanceRecords }
}
