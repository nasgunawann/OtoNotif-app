import "./load-env";
import { Client } from "pg";
import { runMigrations } from "../src/db/migrate";
import { execSync } from "child_process";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/otonotif";

async function main() {
  console.log("Resetting database schema (dropping and recreating public schema)...");
  
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    await client.query("DROP SCHEMA IF EXISTS public CASCADE;");
    await client.query("CREATE SCHEMA public;");
    await client.query("GRANT ALL ON SCHEMA public TO postgres;");
    await client.query("GRANT ALL ON SCHEMA public TO public;");
    console.log("Schema reset successfully!");
  } finally {
    await client.end();
  }

  console.log("Running migrations...");
  await runMigrations();
  console.log("Migrations complete!");

  const shouldSeed = process.argv.includes("--seed");
  if (shouldSeed) {
    console.log("Running seed...");
    try {
      execSync("pnpm run db:seed", { stdio: "inherit" });
      console.log("Reset and seed complete!");
    } catch (error) {
      console.error("Failed to run seed script:", error);
    }
  } else {
    console.log("Reset complete (no seed requested).");
  }
}

main().catch(console.error);
