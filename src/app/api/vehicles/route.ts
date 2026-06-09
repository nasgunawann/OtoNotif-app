import db from "@/db";
import { vehicles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getLatestOdometer } from "@/lib/odometer";

export async function GET() {
  const all = await db.select().from(vehicles).orderBy(desc(vehicles.createdAt)).all();
  const data = await Promise.all(
    all.map(async (v) => {
      const latest = await getLatestOdometer(v.id);
      return {
        ...v,
        latestOdo: latest.reading,
        latestOdoDate: latest.date,
      };
    })
  );
  return Response.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const vehicle = {
    id,
    name: body.name,
    type: body.type,
    image: body.image || "",
    engine: body.engine || "",
    fuelCapacity: body.fuelCapacity ?? 0,
    isPrimary: body.isPrimary ?? false,
    taxDueDate: body.taxDueDate ?? null,
    taxReminderDays: body.taxReminderDays ?? 30,
    taxIntervalYears: body.taxIntervalYears ?? 1,
    taxAmount: body.taxAmount ?? 0,
    lastTaxPaidDate: body.lastTaxPaidDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(vehicles).values(vehicle);
  return Response.json({ data: vehicle }, { status: 201 });
}
