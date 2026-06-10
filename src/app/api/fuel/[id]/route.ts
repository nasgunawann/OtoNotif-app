import db from "@/db";
import { vehicles, fuelLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const [log] = await db
    .select({ vehicleId: fuelLogs.vehicleId })
    .from(fuelLogs)
    .where(eq(fuelLogs.id, id))
    .limit(1);
  if (!log) return unauth();

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, log.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  await db.delete(fuelLogs).where(eq(fuelLogs.id, id));
  return Response.json({ data: { id } });
}
