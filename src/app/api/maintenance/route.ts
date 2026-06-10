import db from "@/db";
import { vehicles, maintenanceRecords, components } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireFields, requireAuth, unauth } from "@/lib/api-validate";

export async function GET(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  const ownedVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, userId));
  const ownedIds = new Set(ownedVehicles.map((v) => v.id));

  if (vehicleId) {
    if (!ownedIds.has(vehicleId)) return unauth();
    const records = await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.vehicleId, vehicleId))
      .orderBy(desc(maintenanceRecords.date));
    return Response.json({ data: records });
  }

  const all = await db
    .select()
    .from(maintenanceRecords)
    .orderBy(desc(maintenanceRecords.date));

  const filtered = all.filter((r) => ownedIds.has(r.vehicleId));
  return Response.json({ data: filtered });
}

export async function POST(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "date"]);
  if (error) return Response.json({ error }, { status: 400 });

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, body.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record = {
    id,
    vehicleId: body.vehicleId,
    componentId: body.componentId ?? null,
    date: body.date,
    description: body.description,
    cost: body.cost ?? 0,
    odoReading: body.odoReading ?? 0,
    notes: body.notes || "",
    createdAt: now,
  };

  await db.insert(maintenanceRecords).values(record);

  if (body.componentId && body.odoReading > 0) {
    await db
      .update(components)
      .set({ lastReplacedOdo: body.odoReading, updatedAt: now })
      .where(eq(components.id, body.componentId));
  }

  return Response.json({ data: record }, { status: 201 });
}
