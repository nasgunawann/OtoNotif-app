import db from "@/db";
import { fuelLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(fuelLogs).where(eq(fuelLogs.id, id));
  return Response.json({ data: { id } });
}
