import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/otonotif",
});
const db = drizzle(pool, { schema });

const now = new Date().toISOString();
const nowPg = new Date();

const motorId = crypto.randomUUID();
const mobilId = crypto.randomUUID();

async function seed() {
  console.log("Seeding database...");

  const demoUserId = crypto.randomUUID()
  await db.insert(schema.user).values({
    id: demoUserId,
    name: "Demo User",
    email: "demo@otonotif.app",
    emailVerified: false,
    image: null,
    createdAt: nowPg,
    updatedAt: nowPg,
  })

  await db.insert(schema.vehicles).values([
    { id: motorId, userId: demoUserId, name: "Supra Bapak", type: "motor", image: "/motorcycle_supra_mockup.png", engine: "125cc", fuelCapacity: 4, isPrimary: true, createdAt: now, updatedAt: now },
    { id: mobilId, userId: demoUserId, name: "Civic Turbo", type: "mobil", image: "/car_civic_mockup.png", engine: "1500cc Turbo", fuelCapacity: 47, isPrimary: false, createdAt: now, updatedAt: now },
  ]);

  await db.insert(schema.odometerReadings).values([
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 12500, date: "2026-06-01", notes: "Bensin abis", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, reading: 45200, date: "2026-05-28", notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 12300, date: "2026-05-15", notes: "Servis rutin", createdAt: now },
  ]);

  await db.insert(schema.components).values([
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Oli Mesin", intervalKm: 2000, lastReplacedOdo: 10500, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "V-Belt", intervalKm: 10000, lastReplacedOdo: 8500, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Ban Luar", intervalKm: 15000, lastReplacedOdo: 12000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Filter Udara", intervalKm: 5000, lastReplacedOdo: 4000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Oli Mesin", intervalKm: 5000, lastReplacedOdo: 40000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Filter Udara", intervalKm: 10000, lastReplacedOdo: 35000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Busi", intervalKm: 15000, lastReplacedOdo: 30000, notes: "", createdAt: now, updatedAt: now },
  ]);

  await db.insert(schema.fuelLogs).values([
    { id: crypto.randomUUID(), vehicleId: mobilId, date: "2026-06-01", liters: 25, amount: 300000, fuelType: "Pertamax", odoReading: 45200, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, date: "2026-05-30", liters: 3.5, amount: 35000, fuelType: "Pertalite", odoReading: 12100, notes: "", createdAt: now },
  ]);

  await db.insert(schema.maintenanceRecords).values([
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: null, date: "2026-05-28", description: "Ganti V-Belt", cost: 150000, odoReading: 12300, notes: "", createdAt: now },
  ]);

  console.log("Seed complete!");
  await pool.end();
}

seed().catch(console.error);
