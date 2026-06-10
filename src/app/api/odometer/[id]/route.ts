import db from "@/db";
import { vehicles, odometerReadings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const [reading] = await db
    .select({ vehicleId: odometerReadings.vehicleId })
    .from(odometerReadings)
    .where(eq(odometerReadings.id, id))
    .limit(1);
  if (!reading) return unauth();

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, reading.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  await db.delete(odometerReadings).where(eq(odometerReadings.id, id));
  return Response.json({ data: { id } });
}
