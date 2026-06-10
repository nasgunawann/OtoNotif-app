import db from "@/db";
import { vehicles } from "@/db/schema";
import { desc, sql, getTableColumns } from "drizzle-orm";
import { requireFields } from "@/lib/api-validate";

export async function GET() {
  const data = await db
    .select({
      ...getTableColumns(vehicles),
      latestOdo: sql<number | null>`
        GREATEST(
          COALESCE((SELECT MAX(reading) FROM odometer_readings WHERE vehicle_id = ${vehicles.id}), 0),
          COALESCE((SELECT MAX(odo_reading) FROM fuel_logs WHERE vehicle_id = ${vehicles.id}), 0),
          COALESCE((SELECT MAX(odo_reading) FROM maintenance_records WHERE vehicle_id = ${vehicles.id}), 0)
        )
      `.mapWith(Number),
      latestOdoDate: sql<string | null>`
        (SELECT date FROM (
          SELECT date, reading FROM odometer_readings WHERE vehicle_id = ${vehicles.id}
          UNION ALL
          SELECT date, odo_reading FROM fuel_logs WHERE vehicle_id = ${vehicles.id} AND odo_reading IS NOT NULL
          UNION ALL
          SELECT date, odo_reading FROM maintenance_records WHERE vehicle_id = ${vehicles.id} AND odo_reading IS NOT NULL
        ) sub ORDER BY reading DESC LIMIT 1)
      `,
    })
    .from(vehicles)
    .orderBy(desc(vehicles.createdAt));

  return Response.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const error = requireFields(body, ["name", "type"]);
  if (error) return Response.json({ error }, { status: 400 });

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
