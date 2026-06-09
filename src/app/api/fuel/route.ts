import db from "@/db";
import { fuelLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (vehicleId) {
    const logs = await db
      .select()
      .from(fuelLogs)
      .where(eq(fuelLogs.vehicleId, vehicleId))
      .orderBy(desc(fuelLogs.date))
      .all();
    return Response.json({ data: logs });
  }

  const all = await db.select().from(fuelLogs).orderBy(desc(fuelLogs.date)).all();
  return Response.json({ data: all });
}

export async function POST(request: Request) {
  const body = await request.json();
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
