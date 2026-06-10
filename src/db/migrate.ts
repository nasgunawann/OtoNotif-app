import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "./index";
import path from "path";

export async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "src/db/migrations"),
    });
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e);
    const cause = e && typeof e === "object" && "cause" in e ? String(e.cause) : "";
    if (msg.includes("already exists") || cause.includes("already exists")) {
      console.log("[migrate] Schema already up to date, skipping");
      return;
    }
    throw e;
  }
}
