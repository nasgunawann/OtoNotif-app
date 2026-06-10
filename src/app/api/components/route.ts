import db from "@/db";
import { components } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireFields } from "@/lib/api-validate";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");

  if (!vehicleId) {
    return Response.json({ error: "vehicleId is required" }, { status: 400 });
  }

  const comps = await db
    .select()
    .from(components)
    .where(eq(components.vehicleId, vehicleId))
    .all();

  return Response.json({ data: comps });
}

export async function POST(request: Request) {
  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "name", "intervalKm"]);
  if (error) return Response.json({ error }, { status: 400 });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const component = {
    id,
    vehicleId: body.vehicleId,
    name: body.name,
    intervalKm: body.intervalKm,
    lastReplacedOdo: body.lastReplacedOdo ?? 0,
    notes: body.notes || "",
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(components).values(component);
  return Response.json({ data: component }, { status: 201 });
}
