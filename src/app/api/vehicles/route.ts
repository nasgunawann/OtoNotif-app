import db from "@/db";
import { vehicles } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  return Response.json({ data: all });
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
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(vehicles).values(vehicle);
  return Response.json({ data: vehicle }, { status: 201 });
}
