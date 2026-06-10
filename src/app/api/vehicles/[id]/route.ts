import db from "@/db";
import { vehicles, odometerReadings, fuelLogs, components, maintenanceRecords } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

async function deleteVehicle(id: string) {
  await db.transaction(async (tx) => {
    await tx.delete(maintenanceRecords).where(eq(maintenanceRecords.vehicleId, id));
    await tx.delete(components).where(eq(components.vehicleId, id));
    await tx.delete(odometerReadings).where(eq(odometerReadings.vehicleId, id));
    await tx.delete(fuelLogs).where(eq(fuelLogs.vehicleId, id));
    await tx.delete(vehicles).where(eq(vehicles.id, id));
  });
}

async function getOwnedVehicle(id: string, userId: string) {
  const [v] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
    .limit(1);
  return v;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const vehicle = await getOwnedVehicle(id, userId);

  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return Response.json({ data: vehicle });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const body = await request.json();
  const now = new Date().toISOString();

  const existing = await getOwnedVehicle(id, userId);
  if (!existing) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  if (body.isPrimary === true) {
    await db
      .update(vehicles)
      .set({ isPrimary: false, updatedAt: now })
      .where(and(ne(vehicles.id, id), eq(vehicles.userId, userId)));
  }

  await db
    .update(vehicles)
    .set({ ...body, updatedAt: now })
    .where(eq(vehicles.id, id));

  const [updated] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return Response.json({ data: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const { id } = await params;
  const vehicle = await getOwnedVehicle(id, userId);
  if (!vehicle) return unauth();

  await deleteVehicle(id);
  return Response.json({ data: { id } });
}
