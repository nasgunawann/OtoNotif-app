import db from "@/db";
import { vehicles, components, maintenanceRecords } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const [comp] = await db
    .select({ vehicleId: components.vehicleId })
    .from(components)
    .where(eq(components.id, id))
    .limit(1);
  if (!comp) return unauth();

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, comp.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.componentId, id));
  await db.delete(components).where(eq(components.id, id));
  return Response.json({ data: { id } });
}
