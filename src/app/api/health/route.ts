import db from "@/db";
import { vehicles, components } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getLatestOdometer, getWeeklyOdometerDelta, getFuelStats, getMonthlyOperatingCost } from "@/lib/odometer";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (!vehicleId) {
    return Response.json({ error: "vehicleId is required" }, { status: 400 });
  }

  const vehicle = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, vehicleId))
    .get();

  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  const latestOdoData = await getLatestOdometer(vehicleId);
  const currentOdo = latestOdoData.reading;
  const lastUpdate = latestOdoData.date;

  const comps = await db
    .select()
    .from(components)
    .where(eq(components.vehicleId, vehicleId))
    .all();

  let totalHealth = 100;
  let componentCount = 0;

  const componentHealth = comps.map((comp) => {
    const usedKm = currentOdo - (comp.lastReplacedOdo ?? 0);
    const remainingKm = Math.max(0, comp.intervalKm - usedKm);
    const usagePercent = Math.min(100, (usedKm / comp.intervalKm) * 100);
    const status =
      usagePercent > 85 ? "danger" as const
      : usagePercent > 70 ? "warning" as const
      : "safe" as const;

    totalHealth -= usagePercent > 85 ? 15 : usagePercent > 70 ? 5 : 0;
    componentCount++;
    return { component: comp, currentOdo, usedKm, remainingKm, usagePercent, status };
  });

  const health = componentCount > 0 ? Math.max(0, Math.round(totalHealth / componentCount)) : 100;

  const fuelStats = await getFuelStats(vehicleId, vehicle.fuelCapacity, currentOdo);
  const weeklyOdoDelta = await getWeeklyOdometerDelta(vehicleId, currentOdo);
  const monthlyCost = await getMonthlyOperatingCost(vehicleId);

  const today = new Date();
  const taxStatus: {
    dueDate: string | null;
    daysRemaining: number | null;
    amount: number;
    lastPaidDate: string | null;
    status: "safe" | "warning" | "danger" | "none";
  } = {
    dueDate: vehicle.taxDueDate ?? null,
    daysRemaining: null,
    amount: vehicle.taxAmount ?? 0,
    lastPaidDate: vehicle.lastTaxPaidDate ?? null,
    status: "none",
  };

  if (vehicle.taxDueDate) {
    const due = new Date(vehicle.taxDueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const reminderDays = vehicle.taxReminderDays ?? 30;
    taxStatus.daysRemaining = diff;
    if (diff <= 0) {
      taxStatus.status = "danger";
    } else if (diff <= reminderDays) {
      taxStatus.status = "warning";
    } else {
      taxStatus.status = "safe";
    }
  }

  return Response.json({
    data: {
      vehicle,
      latestOdo: currentOdo || null,
      health,
      components: componentHealth,
      lastUpdate,
      fuel: fuelStats,
      monthlyCost,
      weeklyOdoDelta,
      latestFuelLog: fuelStats.latestFuelLog,
      taxStatus,
    },
  });
}
