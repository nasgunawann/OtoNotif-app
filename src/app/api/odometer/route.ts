import db from "@/db";
import { vehicles, odometerReadings } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireFields, requireAuth, unauth } from "@/lib/api-validate";

export async function GET(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (!vehicleId) {
    return Response.json({ error: "vehicleId is required" }, { status: 400 });
  }

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  const readings = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId))
    .orderBy(desc(odometerReadings.date));

  return Response.json({ data: readings });
}

export async function POST(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "reading", "date"]);
  if (error) return Response.json({ error }, { status: 400 });

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, body.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const reading = {
    id,
    vehicleId: body.vehicleId,
    reading: body.reading,
    date: body.date,
    notes: body.notes || "",
    createdAt: now,
  };

  await db.insert(odometerReadings).values(reading);
  return Response.json({ data: reading }, { status: 201 });
}
