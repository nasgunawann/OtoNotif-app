import type { Vehicle, OdometerReading, FuelLog, Component, MaintenanceRecord, VehicleHealth, ComponentHealth, Notification } from "@/lib/types"

export function computeLatestOdometer(
  vehicleId: string,
  allReadings: OdometerReading[],
  allFuelLogs: FuelLog[],
  allMaintRecords: MaintenanceRecord[]
): { reading: number; date: string | null } {
  const vehicleReadings = allReadings.filter((r) => r.vehicleId === vehicleId)
  const vehicleFuelLogs = allFuelLogs.filter((l) => l.vehicleId === vehicleId)
  const vehicleMaintRecords = allMaintRecords.filter((r) => r.vehicleId === vehicleId)

  const sortByDateDesc = <T extends { date: string; reading?: number; odoReading?: number }>(arr: T[]) =>
    arr.sort((a, b) => b.date.localeCompare(a.date) || (b.odoReading ?? b.reading ?? 0) - (a.odoReading ?? a.reading ?? 0))

  const latestOdo = sortByDateDesc(vehicleReadings)[0]
  const latestFuel = sortByDateDesc(vehicleFuelLogs)[0]
  const latestMaint = sortByDateDesc(vehicleMaintRecords)[0]

  let reading = latestOdo?.reading ?? 0
  let date = latestOdo?.date ?? null

  if (latestFuel && latestFuel.odoReading && latestFuel.odoReading > reading) {
    reading = latestFuel.odoReading
    date = latestFuel.date
  }
  if (latestMaint && latestMaint.odoReading && latestMaint.odoReading > reading) {
    reading = latestMaint.odoReading
    date = latestMaint.date
  }
  return { reading, date }
}

export function computeWeeklyOdometerDelta(
  vehicleId: string,
  currentOdo: number,
  allReadings: OdometerReading[],
  allFuelLogs: FuelLog[],
  allMaintRecords: MaintenanceRecord[]
): number {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const filterBefore = <T extends { vehicleId: string; date: string; reading?: number; odoReading?: number }>(arr: T[]) =>
    arr.filter((r) => r.vehicleId === vehicleId && r.date <= sevenDaysAgo)
      .sort((a, b) => b.date.localeCompare(a.date) || (b.odoReading ?? b.reading ?? 0) - (a.odoReading ?? a.reading ?? 0))

  const odoBefore = filterBefore(allReadings)[0]
  const fuelBefore = filterBefore(allFuelLogs)[0]
  const maintBefore = filterBefore(allMaintRecords)[0]

  let pastOdo = 0
  if (odoBefore) pastOdo = Math.max(pastOdo, odoBefore.reading)
  if (fuelBefore && fuelBefore.odoReading) pastOdo = Math.max(pastOdo, fuelBefore.odoReading)
  if (maintBefore && maintBefore.odoReading) pastOdo = Math.max(pastOdo, maintBefore.odoReading)

  if (pastOdo === 0) {
    const ascSort = <T extends { vehicleId: string; date: string; reading?: number; odoReading?: number }>(arr: T[]) =>
      arr.filter((r) => r.vehicleId === vehicleId)
        .sort((a, b) => a.date.localeCompare(b.date) || (a.odoReading ?? a.reading ?? 0) - (b.odoReading ?? b.reading ?? 0))
    const firstOdo = ascSort(allReadings)[0]
    const firstFuel = ascSort(allFuelLogs)[0]
    const firstMaint = ascSort(allMaintRecords)[0]

    let earliestOdo = currentOdo
    if (firstOdo) earliestOdo = Math.min(earliestOdo, firstOdo.reading)
    if (firstFuel && firstFuel.odoReading) earliestOdo = Math.min(earliestOdo, firstFuel.odoReading)
    if (firstMaint && firstMaint.odoReading) earliestOdo = Math.min(earliestOdo, firstMaint.odoReading)
    return Math.max(0, currentOdo - earliestOdo)
  }

  return Math.max(0, currentOdo - pastOdo)
}

export function computeFuelStats(
  vehicleId: string,
  fuelCapacity: number,
  currentOdo: number,
  allFuelLogs: FuelLog[]
): {
  current: number
  max: number
  percent: number
  avg: string
  latestFuelLog: FuelLog | null
  estimating: boolean
} {
  const logs = allFuelLogs
    .filter((l) => l.vehicleId === vehicleId)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.odoReading) - (a.odoReading))

  if (logs.length === 0) {
    return { current: 0, max: fuelCapacity, percent: 0, avg: "—", latestFuelLog: null, estimating: true }
  }

  const logsAsc = [...logs].reverse()
  let totalDistance = 0
  let totalLiters = 0

  for (let i = 1; i < logsAsc.length; i++) {
    const prev = logsAsc[i - 1]
    const curr = logsAsc[i]
    if (curr.odoReading && prev.odoReading && curr.odoReading > prev.odoReading) {
      totalDistance += curr.odoReading - prev.odoReading
      totalLiters += prev.liters
    }
  }

  const avgConsumption = totalLiters > 0 ? totalDistance / totalLiters : null
  const latestLog = logs[0]
  let estimatedRemaining = latestLog.liters

  if (avgConsumption && latestLog.odoReading && currentOdo > latestLog.odoReading) {
    const burned = (currentOdo - latestLog.odoReading) / avgConsumption
    estimatedRemaining = Math.max(0, latestLog.liters - burned)
  }

  const max = fuelCapacity || 10
  const current = Math.min(max, estimatedRemaining)
  const percent = (current / max) * 100

  return {
    current: Math.round(current * 10) / 10,
    max,
    percent: Math.round(percent),
    avg: avgConsumption ? `${Math.round(avgConsumption * 10) / 10} km/L` : "—",
    latestFuelLog: latestLog,
    estimating: !avgConsumption,
  }
}

export function computeMonthlyOperatingCost(
  vehicleId: string,
  allFuelLogs: FuelLog[],
  allMaintRecords: MaintenanceRecord[]
): number {
  const currentYearMonth = new Date().toISOString().slice(0, 7)
  const fuelCost = allFuelLogs
    .filter((l) => l.vehicleId === vehicleId && l.date.startsWith(currentYearMonth))
    .reduce((s, l) => s + (l.amount ?? 0), 0)
  const maintCost = allMaintRecords
    .filter((r) => r.vehicleId === vehicleId && r.date.startsWith(currentYearMonth))
    .reduce((s, r) => s + (r.cost ?? 0), 0)
  return fuelCost + maintCost
}

export function computeVehicleHealth(
  vehicle: Vehicle,
  allReadings: OdometerReading[],
  allFuelLogs: FuelLog[],
  allMaintRecords: MaintenanceRecord[],
  allComponents: Component[]
): VehicleHealth {
  const latestOdoData = computeLatestOdometer(vehicle.id, allReadings, allFuelLogs, allMaintRecords)
  const currentOdo = latestOdoData.reading
  const lastUpdate = latestOdoData.date

  let dangerCount = 0
  let warningCount = 0
  let safeCount = 0

  const vehicleComps = allComponents.filter((c) => c.vehicleId === vehicle.id)
  const componentHealth: ComponentHealth[] = vehicleComps.map((comp) => {
    const usedKm = currentOdo - (comp.lastReplacedOdo ?? 0)
    const remainingKm = Math.max(0, comp.intervalKm - usedKm)
    const usagePercent = Math.min(100, (usedKm / comp.intervalKm) * 100)
    const status = usagePercent > 85 ? "danger" as const : usagePercent > 70 ? "warning" as const : "safe" as const
    if (status === "danger") dangerCount++
    else if (status === "warning") warningCount++
    else safeCount++
    return { component: comp, currentOdo, usedKm, remainingKm, usagePercent, status }
  })

  const fuelStats = computeFuelStats(vehicle.id, vehicle.fuelCapacity, currentOdo, allFuelLogs)
  const weeklyOdoDelta = computeWeeklyOdometerDelta(vehicle.id, currentOdo, allReadings, allFuelLogs, allMaintRecords)
  const monthlyCost = computeMonthlyOperatingCost(vehicle.id, allFuelLogs, allMaintRecords)

  const today = new Date()
  const taxStatus: VehicleHealth["taxStatus"] = vehicle.taxDueDate
    ? (() => {
        const diff = Math.ceil((new Date(vehicle.taxDueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const reminderDays = vehicle.taxReminderDays ?? 30
        return {
          dueDate: vehicle.taxDueDate,
          daysRemaining: diff,
          amount: vehicle.taxAmount ?? 0,
          lastPaidDate: vehicle.lastTaxPaidDate ?? null,
          status: diff <= 0 ? "danger" as const : diff <= reminderDays ? "warning" as const : "safe" as const,
        }
      })()
    : { dueDate: null, daysRemaining: null, amount: vehicle.taxAmount ?? 0, lastPaidDate: null, status: "none" as const }

  return {
    vehicle,
    latestOdo: currentOdo || null,
    componentSummary: { total: vehicleComps.length, danger: dangerCount, warning: warningCount, safe: safeCount },
    components: componentHealth,
    lastUpdate,
    fuel: fuelStats,
    monthlyCost,
    weeklyOdoDelta,
    latestFuelLog: fuelStats.latestFuelLog,
    taxStatus,
  }
}

export function computeNotifications(
  vehicles: Vehicle[],
  allReadings: OdometerReading[],
  allComponents: Component[]
): Notification[] {
  const notifications: Notification[] = []

  for (const v of vehicles) {
    const vehicleReadings = allReadings.filter((r) => r.vehicleId === v.id)
    const latestOdo = vehicleReadings.sort((a, b) => b.date.localeCompare(a.date) || b.reading - a.reading)[0]
    const comps = allComponents.filter((c) => c.vehicleId === v.id)

    for (const comp of comps) {
      const currentOdo = latestOdo?.reading ?? comp.lastReplacedOdo ?? 0
      const usedKm = currentOdo - (comp.lastReplacedOdo ?? 0)
      const remainingKm = comp.intervalKm - usedKm

      if (remainingKm <= 0) {
        notifications.push({ id: crypto.randomUUID(), title: `Ganti ${comp.name} - ${v.name}`, description: `Sudah melebihi interval ${comp.intervalKm} km. Segera ganti!`, time: "Sekarang", type: "danger", icon: "IconTool" })
      } else if (remainingKm <= comp.intervalKm * 0.15) {
        notifications.push({ id: crypto.randomUUID(), title: `${comp.name} - ${v.name} hampir habis`, description: `Sisa ${remainingKm} km lagi. Segera jadwalkan penggantian.`, time: "Hari ini", type: "warning", icon: "IconAlertCircle" })
      }
    }

    if (!latestOdo) {
      notifications.push({ id: crypto.randomUUID(), title: `Odometer ${v.name} Belum Dicatat`, description: `Belum ada pembaruan odometer untuk ${v.name}.`, time: "Segera", type: "warning", icon: "IconGauge" })
    }

    if (v.taxDueDate) {
      const today = new Date()
      const due = new Date(v.taxDueDate)
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const reminderDays = v.taxReminderDays ?? 30

      if (diff <= 0) {
        notifications.push({ id: crypto.randomUUID(), title: `Pajak ${v.name} Jatuh Tempo!`, description: `Pajak ${v.name} sudah lewat ${Math.abs(diff)} hari. Segera bayar!`, time: "Overdue", type: "danger", icon: "IconReceipt" })
      } else if (diff <= reminderDays) {
        notifications.push({ id: crypto.randomUUID(), title: `Pajak ${v.name} Akan Jatuh Tempo`, description: `Sisa ${diff} hari lagi. Segera siapkan pembayaran.`, time: `H-${diff}`, type: "warning", icon: "IconReceipt" })
      }
    }
  }

  return notifications
}
