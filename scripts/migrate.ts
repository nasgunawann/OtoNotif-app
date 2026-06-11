import { runMigrations } from "../src/db/migrate";

async function main() {
  console.log("Running pending migrations...");
  await runMigrations();
  console.log("Migrations successfully completed!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
