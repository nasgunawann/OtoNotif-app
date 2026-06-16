import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, unauth } from "@/lib/api-validate";

export async function POST() {
  const { userId } = await requireAuth().catch(() => ({ userId: null }));
  if (!userId) return unauth();

  try {
    await db.delete(user).where(eq(user.id, userId));
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
