import { runMigrations } from "@/db/migrate"

export function register() {
  runMigrations()
}
