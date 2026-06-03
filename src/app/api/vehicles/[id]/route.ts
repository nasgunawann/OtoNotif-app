import db from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, id)).get();

  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return Response.json({ data: vehicle });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const now = new Date().toISOString();

  const existing = await db.select().from(vehicles).where(eq(vehicles.id, id)).get();
  if (!existing) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }

  await db
    .update(vehicles)
    .set({ ...body, updatedAt: now })
    .where(eq(vehicles.id, id));

  const updated = await db.select().from(vehicles).where(eq(vehicles.id, id)).get();
  return Response.json({ data: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(vehicles).where(eq(vehicles.id, id));
  return Response.json({ data: { id } });
}
