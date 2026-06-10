import db from "@/db";
import { vehicles, fuelLogs } from "@/db/schema";
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
    const logs = await db
      .select()
      .from(fuelLogs)
      .where(eq(fuelLogs.vehicleId, vehicleId))
      .orderBy(desc(fuelLogs.date));
    return Response.json({ data: logs });
  }

  const all = await db
    .select()
    .from(fuelLogs)
    .orderBy(desc(fuelLogs.date));

  const filtered = all.filter((l) => ownedIds.has(l.vehicleId));
  return Response.json({ data: filtered });
}

export async function POST(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "liters", "amount", "fuelType", "date"]);
  if (error) return Response.json({ error }, { status: 400 });

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, body.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const log = {
    id,
    vehicleId: body.vehicleId,
    date: body.date,
    liters: body.liters,
    amount: body.amount,
    fuelType: body.fuelType,
    odoReading: body.odoReading ?? 0,
    isFull: body.isFull ?? false,
    kmPerLiter: body.kmPerLiter ?? null,
    notes: body.notes || "",
    createdAt: now,
  };

  await db.insert(fuelLogs).values(log);
  return Response.json({ data: log }, { status: 201 });
}
