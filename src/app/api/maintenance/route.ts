import db from "@/db";
import { maintenanceRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (vehicleId) {
    const records = await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.vehicleId, vehicleId))
      .orderBy(desc(maintenanceRecords.date))
      .all();
    return Response.json({ data: records });
  }

  const all = await db
    .select()
    .from(maintenanceRecords)
    .orderBy(desc(maintenanceRecords.date))
    .all();

  return Response.json({ data: all });
}

export async function POST(request: Request) {
  const body = await request.json();
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
  return Response.json({ data: record }, { status: 201 });
}
