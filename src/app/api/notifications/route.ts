import db from "@/db";
import { vehicles, odometerReadings, components } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function GET() {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const userVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, userId));

  const notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: "warning" | "danger" | "success";
    icon: string;
  }> = [];

  for (const v of userVehicles) {
    const [latestOdo] = await db
      .select()
      .from(odometerReadings)
      .where(eq(odometerReadings.vehicleId, v.id))
      .orderBy(desc(odometerReadings.date))
      .limit(1);

    const comps = await db
      .select()
      .from(components)
      .where(eq(components.vehicleId, v.id));

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
          icon: "IconTool",
        });
      } else if (remainingKm <= comp.intervalKm * 0.15) {
        notifications.push({
          id: crypto.randomUUID(),
          title: `${comp.name} - ${v.name} hampir habis`,
          description: `Sisa ${remainingKm} km lagi. Segera jadwalkan penggantian.`,
          time: "Hari ini",
          type: "warning",
          icon: "IconAlertCircle",
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
        icon: "IconGauge",
      });
    }

    if (v.taxDueDate) {
      const today = new Date();
      const due = new Date(v.taxDueDate);
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const reminderDays = v.taxReminderDays ?? 30;

      if (diff <= 0) {
        notifications.push({
          id: crypto.randomUUID(),
          title: `Pajak ${v.name} Jatuh Tempo!`,
          description: `Pajak ${v.name} sudah lewat ${Math.abs(diff)} hari. Segera bayar!`,
          time: "Overdue",
          type: "danger",
          icon: "IconReceipt",
        });
      } else if (diff <= reminderDays) {
        notifications.push({
          id: crypto.randomUUID(),
          title: `Pajak ${v.name} Akan Jatuh Tempo`,
          description: `Sisa ${diff} hari lagi. Segera siapkan pembayaran.`,
          time: `H-${diff}`,
          type: "warning",
          icon: "IconReceipt",
        });
      }
    }
  }

  return Response.json({ data: notifications });
}
