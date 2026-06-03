import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL || "file:./otonotif.db";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: dbUrl.startsWith("postgres") ? "postgresql" : "sqlite",
  dbCredentials: {
    url: dbUrl,
  },
});
