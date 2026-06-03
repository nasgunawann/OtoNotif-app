import db from "@/db";
import { vehicles, odometerReadings, components } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  const allVehicles = await db.select().from(vehicles).all();
  const notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: "warning" | "danger" | "success";
  }> = [];

  for (const v of allVehicles) {
    const latestOdo = await db
      .select()
      .from(odometerReadings)
      .where(eq(odometerReadings.vehicleId, v.id))
      .orderBy(desc(odometerReadings.date))
      .get();

    const comps = await db
      .select()
      .from(components)
      .where(eq(components.vehicleId, v.id))
      .all();

    for (const comp of comps) {
      const currentOdo = latestOdo?.reading ?? comp.lastReplacedOdo ?? 0;
      const usedKm = currentOdo - (comp.lastReplacedOdo ?? 0);
      const remainingKm = comp.intervalKm - usedKm;

      if (remainingKm <= 0) {
        notifications.push({
          id: crypto.randomUUID(),
          title: `Ganti ${comp.name} - ${v.name}`,
          description: `Sudah melebihi interval ${comp.intervalKm} km. Segera ganti!`,
          time: "Sekarang",
          type: "danger",
        });
      } else if (remainingKm <= comp.intervalKm * 0.15) {
        notifications.push({
          id: crypto.randomUUID(),
          title: `${comp.name} - ${v.name} hampir habis`,
          description: `Sisa ${remainingKm} km lagi. Segera jadwalkan penggantian.`,
          time: "Hari ini",
          type: "warning",
        });
      }
    }

    if (!latestOdo) {
      notifications.push({
        id: crypto.randomUUID(),
        title: `Odometer ${v.name} Belum Dicatat`,
        description: `Belum ada pembaruan odometer untuk ${v.name}.`,
        time: "Segera",
        type: "warning",
      });
    }
  }

  return Response.json({ data: notifications });
}
