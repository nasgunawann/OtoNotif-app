import db from "@/db";
import { odometerReadings, fuelLogs, maintenanceRecords } from "@/db/schema";
import type { FuelLog } from "@/lib/types";
import { eq, desc, and, lte, sql } from "drizzle-orm";

export async function getLatestOdometer(vehicleId: string): Promise<{ reading: number; date: string | null }> {
  const latestOdoRecord = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId))
    .orderBy(desc(odometerReadings.date), desc(odometerReadings.reading))
    .get();

  const latestFuelLog = await db
    .select()
    .from(fuelLogs)
    .where(eq(fuelLogs.vehicleId, vehicleId))
    .orderBy(desc(fuelLogs.date), desc(fuelLogs.odoReading))
    .get();

  const latestMaintRecord = await db
    .select()
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.vehicleId, vehicleId))
    .orderBy(desc(maintenanceRecords.date), desc(maintenanceRecords.odoReading))
    .get();

  let reading = latestOdoRecord?.reading ?? 0;
  let date = latestOdoRecord?.date ?? null;

  if (latestFuelLog && latestFuelLog.odoReading && latestFuelLog.odoReading > reading) {
    reading = latestFuelLog.odoReading;
    date = latestFuelLog.date;
  }

  if (latestMaintRecord && latestMaintRecord.odoReading && latestMaintRecord.odoReading > reading) {
    reading = latestMaintRecord.odoReading;
    date = latestMaintRecord.date;
  }

  return { reading, date };
}

export async function getWeeklyOdometerDelta(vehicleId: string, currentOdo: number): Promise<number> {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

  const odoBefore = await db
    .select()
    .from(odometerReadings)
    .where(and(eq(odometerReadings.vehicleId, vehicleId), lte(odometerReadings.date, sevenDaysAgoStr)))
    .orderBy(desc(odometerReadings.date), desc(odometerReadings.reading))
    .get();
  
  const fuelBefore = await db
    .select()
    .from(fuelLogs)
    .where(and(eq(fuelLogs.vehicleId, vehicleId), lte(fuelLogs.date, sevenDaysAgoStr)))
    .orderBy(desc(fuelLogs.date), desc(fuelLogs.odoReading))
    .get();

  const maintBefore = await db
    .select()
    .from(maintenanceRecords)
    .where(and(eq(maintenanceRecords.vehicleId, vehicleId), lte(maintenanceRecords.date, sevenDaysAgoStr)))
    .orderBy(desc(maintenanceRecords.date), desc(maintenanceRecords.odoReading))
    .get();

  let pastOdo = 0;

  if (odoBefore) pastOdo = Math.max(pastOdo, odoBefore.reading);
  if (fuelBefore && fuelBefore.odoReading) pastOdo = Math.max(pastOdo, fuelBefore.odoReading);
  if (maintBefore && maintBefore.odoReading) pastOdo = Math.max(pastOdo, maintBefore.odoReading);

  if (pastOdo === 0) {
    // If no record is older than 7 days, find the earliest record overall
    const firstOdo = await db
      .select()
      .from(odometerReadings)
      .where(eq(odometerReadings.vehicleId, vehicleId))
      .orderBy(odometerReadings.date, odometerReadings.reading)
      .get();
    
    const firstFuel = await db
      .select()
      .from(fuelLogs)
      .where(eq(fuelLogs.vehicleId, vehicleId))
      .orderBy(fuelLogs.date, fuelLogs.odoReading)
      .get();

    const firstMaint = await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.vehicleId, vehicleId))
      .orderBy(maintenanceRecords.date, maintenanceRecords.odoReading)
      .get();

    let earliestOdo = currentOdo;
    if (firstOdo) earliestOdo = Math.min(earliestOdo, firstOdo.reading);
    if (firstFuel && firstFuel.odoReading) earliestOdo = Math.min(earliestOdo, firstFuel.odoReading);
    if (firstMaint && firstMaint.odoReading) earliestOdo = Math.min(earliestOdo, firstMaint.odoReading);

    return Math.max(0, currentOdo - earliestOdo);
  }

  return Math.max(0, currentOdo - pastOdo);
}

export async function getFuelStats(
  vehicleId: string,
  fuelCapacity: number,
  currentOdo: number
): Promise<{
  current: number;
  max: number;
  percent: number;
  avg: string;
  latestFuelLog: FuelLog | null;
}> {
  const logs = await db
    .select()
    .from(fuelLogs)
    .where(eq(fuelLogs.vehicleId, vehicleId))
    .orderBy(desc(fuelLogs.date), desc(fuelLogs.odoReading))
    .all();

  if (logs.length === 0) {
    return {
      current: 0,
      max: fuelCapacity,
      percent: 0,
      avg: "—",
      latestFuelLog: null,
    };
  }

  // Sort ascending to calculate average consumption
  const logsAsc = [...logs].reverse();
  let totalDistance = 0;
  let totalLiters = 0;

  for (let i = 1; i < logsAsc.length; i++) {
    const prev = logsAsc[i - 1];
    const curr = logsAsc[i];
    if (curr.odoReading && prev.odoReading && curr.odoReading > prev.odoReading) {
      totalDistance += (curr.odoReading - prev.odoReading);
      totalLiters += curr.liters;
    }
  }

  const avgConsumption = totalLiters > 0 ? (totalDistance / totalLiters) : null;
  const latestLog = logs[0]; // because logs is sorted desc

  let estimatedRemaining = latestLog.liters; // default to last fill up liters if we cannot estimate

  if (avgConsumption && latestLog.odoReading && currentOdo > latestLog.odoReading) {
    const burned = (currentOdo - latestLog.odoReading) / avgConsumption;
    estimatedRemaining = Math.max(0, latestLog.liters - burned);
  }

  // Cap estimated remaining fuel by fuel capacity
  const max = fuelCapacity || 10; // Fallback if capacity is 0
  const current = Math.min(max, estimatedRemaining);
  const percent = (current / max) * 100;

  return {
    current: Math.round(current * 10) / 10, // 1 decimal place
    max,
    percent: Math.round(percent),
    avg: avgConsumption ? `${Math.round(avgConsumption * 10) / 10} km/L` : "—",
    latestFuelLog: latestLog as FuelLog,
  };
}

export async function getMonthlyOperatingCost(vehicleId: string): Promise<number> {
  const today = new Date();
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`; // "YYYY-MM"

  const fuelLogsInMonth = await db
    .select()
    .from(fuelLogs)
    .where(and(eq(fuelLogs.vehicleId, vehicleId), sql`${fuelLogs.date} LIKE ${currentYearMonth + "-%"}`))
    .all();

  const maintRecordsInMonth = await db
    .select()
    .from(maintenanceRecords)
    .where(and(eq(maintenanceRecords.vehicleId, vehicleId), sql`${maintenanceRecords.date} LIKE ${currentYearMonth + "-%"}`))
    .all();

  const fuelCost = fuelLogsInMonth.reduce((sum, log) => sum + (log.amount ?? 0), 0);
  const maintCost = maintRecordsInMonth.reduce((sum, record) => sum + (record.cost ?? 0), 0);

  return fuelCost + maintCost;
}
