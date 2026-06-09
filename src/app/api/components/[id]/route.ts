import db from "@/db";
import { components, maintenanceRecords } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.componentId, id));
  await db.delete(components).where(eq(components.id, id));
  return Response.json({ data: { id } });
}
