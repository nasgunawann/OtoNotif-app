import db from "@/db";
import { vehicles, odometerReadings, fuelLogs, components, maintenanceRecords } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

async function deleteVehicle(id: string) {
  await db.transaction(async (tx) => {
    await tx.delete(maintenanceRecords).where(eq(maintenanceRecords.vehicleId, id));
    await tx.delete(components).where(eq(components.vehicleId, id));
    await tx.delete(odometerReadings).where(eq(odometerReadings.vehicleId, id));
    await tx.delete(fuelLogs).where(eq(fuelLogs.vehicleId, id));
    await tx.delete(vehicles).where(eq(vehicles.id, id));
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);

  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return Response.json({ data: vehicle });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const now = new Date().toISOString();

  const [existing] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  if (!existing) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  if (body.isPrimary === true) {
    await db
      .update(vehicles)
      .set({ isPrimary: false, updatedAt: now })
      .where(ne(vehicles.id, id));
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
  const { id } = await params;
  await deleteVehicle(id);
  return Response.json({ data: { id } });
}
