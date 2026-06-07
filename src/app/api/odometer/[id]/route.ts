import db from "@/db";
import { odometerReadings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(odometerReadings).where(eq(odometerReadings.id, id));
  return Response.json({ data: { id } });
}
