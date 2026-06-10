import { runMigrations } from "@/db/migrate"

export async function register() {
  await runMigrations()
}
