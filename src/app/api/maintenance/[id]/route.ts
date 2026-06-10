import db from "@/db";
import { vehicles, maintenanceRecords } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const [record] = await db
    .select({ vehicleId: maintenanceRecords.vehicleId })
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.id, id))
    .limit(1);
  if (!record) return unauth();

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, record.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));
  return Response.json({ data: { id } });
}
