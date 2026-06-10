import db from "@/db";
import { user, vehicles, odometerReadings, components, fuelLogs, maintenanceRecords } from "@/db/schema";

const now = new Date().toISOString();
const nowPg = new Date();

const demoUserId = crypto.randomUUID();
const motorId = crypto.randomUUID();
const mobilId = crypto.randomUUID();

const seedData = async () => {
  await db.insert(user).values({
    id: demoUserId,
    name: "Demo User",
    email: "demo@otonotif.app",
    emailVerified: false,
    image: null,
    createdAt: nowPg,
    updatedAt: nowPg,
  })

  await db.insert(vehicles).values([
    {
      id: motorId,
      userId: demoUserId,
      name: "Supra Bapak",
      type: "motor",
      image: "/motorcycle_supra_mockup.png",
      engine: "125cc",
      fuelCapacity: 4,
      isPrimary: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: mobilId,
      userId: demoUserId,
      name: "Civic Turbo",
      type: "mobil",
      image: "/car_civic_mockup.png",
      engine: "1500cc Turbo",
      fuelCapacity: 47,
      isPrimary: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await db.insert(odometerReadings).values([
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 12500, date: "2026-05-20", notes: "Bensin abis", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, reading: 45200, date: "2026-05-15", notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, reading: 12300, date: "2026-04-28", notes: "Servis rutin", createdAt: now },
  ]);

  await db.insert(components).values([
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Oli Mesin", intervalKm: 2000, lastReplacedOdo: 10500, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "V-Belt", intervalKm: 10000, lastReplacedOdo: 8500, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Ban Luar", intervalKm: 15000, lastReplacedOdo: 12000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, name: "Filter Udara", intervalKm: 5000, lastReplacedOdo: 4000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Oli Mesin", intervalKm: 5000, lastReplacedOdo: 40000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Filter Udara", intervalKm: 10000, lastReplacedOdo: 35000, notes: "", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), vehicleId: mobilId, name: "Busi", intervalKm: 15000, lastReplacedOdo: 30000, notes: "", createdAt: now, updatedAt: now },
  ]);

  await db.insert(fuelLogs).values([
    { id: crypto.randomUUID(), vehicleId: mobilId, date: "2026-05-20", liters: 25, amount: 300000, fuelType: "Pertamax", odoReading: 45200, notes: "", createdAt: now },
    { id: crypto.randomUUID(), vehicleId: motorId, date: "2026-05-18", liters: 3.5, amount: 35000, fuelType: "Pertalite", odoReading: 12100, notes: "", createdAt: now },
  ]);

  await db.insert(maintenanceRecords).values([
    { id: crypto.randomUUID(), vehicleId: motorId, componentId: null, date: "2026-05-15", description: "Ganti V-Belt", cost: 150000, odoReading: 12300, notes: "", createdAt: now },
  ]);
};

export async function POST() {
  try {
    await seedData();
    return Response.json({ data: { message: "Seed data created successfully" } });
  } catch {
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
