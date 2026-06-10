import db from "@/db";
import { odometerReadings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireFields } from "@/lib/api-validate";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (!vehicleId) {
    return Response.json({ error: "vehicleId is required" }, { status: 400 });
  }

  const readings = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId))
    .orderBy(desc(odometerReadings.date))
    ;

  return Response.json({ data: readings });
}

export async function POST(request: Request) {
  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "reading", "date"]);
  if (error) return Response.json({ error }, { status: 400 });

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
