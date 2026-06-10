import db from "@/db";
import { vehicles, components } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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

  const comps = await db
    .select()
    .from(components)
    .where(eq(components.vehicleId, vehicleId));

  return Response.json({ data: comps });
}

export async function POST(request: Request) {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  const body = await request.json();
  const error = requireFields(body, ["vehicleId", "name", "intervalKm"]);
  if (error) return Response.json({ error }, { status: 400 });

  const [vehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(and(eq(vehicles.id, body.vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  if (!vehicle) return unauth();

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
