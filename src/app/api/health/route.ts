import db from "@/db";
import { vehicles, odometerReadings, components } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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

  const latestOdo = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId))
    .orderBy(desc(odometerReadings.date))
    .get();

  const comps = await db
    .select()
    .from(components)
    .where(eq(components.vehicleId, vehicleId))
    .all();

  const currentOdo = latestOdo?.reading ?? 0;
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

  return Response.json({
    data: {
      vehicle,
      latestOdo: latestOdo?.reading ?? null,
      health,
      components: componentHealth,
      lastUpdate: latestOdo?.date ?? null,
    },
  });
}
