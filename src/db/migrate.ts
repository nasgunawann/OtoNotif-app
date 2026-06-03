import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export function runMigrations() {
  const dbPath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace("file:", "")
    : path.join(process.cwd(), "otonotif.db");

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const migrationsDir = path.join(process.cwd(), "src", "db", "migrations");

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const applied = new Set(
    sqlite
      .prepare("SELECT hash FROM __drizzle_migrations")
      .all()
      .map((r: any) => r.hash)
  );

  for (const file of files) {
    const hash = file.replace(/\.sql$/, "");
    if (applied.has(hash)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    sqlite.exec(sql);
    sqlite
      .prepare("INSERT INTO __drizzle_migrations (hash) VALUES (?)")
      .run(hash);
    console.log(`[migrate] applied ${file}`);
  }

  sqlite.close();
}
