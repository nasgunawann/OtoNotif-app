import db from "@/db";
import { user as userTable, vehicles, odometerReadings, components, fuelLogs, maintenanceRecords } from "@/db/schema";
import { getDemoSeedData } from "@/lib/demo-seed";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { and, lt, like } from "drizzle-orm";

export async function POST() {
  try {
    // 1. Lazy Cleanup: Hapus user demo yang berumur > 24 jam
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    try {
      await db.delete(userTable).where(
        and(
          like(userTable.email, "demo-%@otonotif.app"),
          lt(userTable.createdAt, oneDayAgo)
        )
      );
    } catch (cleanupError) {
      console.error("Failed to run lazy cleanup:", cleanupError);
    }

    // 2. Buat User Demo Baru Programmatis via Better-Auth signUpEmail
    // Menggunakan Better Auth API agar menghasilkan cookie bertanda tangan (signed cookie) yang sah
    const demoEmail = `demo-${crypto.randomUUID().substring(0, 8)}@otonotif.app`;
    const demoPassword = crypto.randomUUID();

    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: "Pengguna Demo",
        email: demoEmail,
        password: demoPassword,
      },
      returnHeaders: true,
    });

    const demoUserId = signUpResult.response.user.id;
    const setCookieHeader = signUpResult.headers.get("set-cookie");

    // 3. Salin Data Seed Template ke Database
    const seed = getDemoSeedData();

    // Salin Kendaraan
    const vehicleIdMap = new Map<string, string>();
    for (const v of seed.vehicles) {
      const newVehicleId = crypto.randomUUID();
      vehicleIdMap.set(v.id, newVehicleId);

      await db.insert(vehicles).values({
        id: newVehicleId,
        userId: demoUserId,
        name: v.name,
        type: v.type,
        image: v.image || "",
        engine: v.engine || "",
        fuelCapacity: v.fuelCapacity ?? 0,
        isPrimary: v.isPrimary ?? false,
        taxDueDate: v.taxDueDate ?? null,
        taxReminderDays: v.taxReminderDays ?? 30,
        taxIntervalYears: v.taxIntervalYears ?? 1,
        taxAmount: v.taxAmount ?? 0,
        lastTaxPaidDate: v.lastTaxPaidDate ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Salin Odometer Readings
    for (const o of seed.odometerReadings) {
      const newVehicleId = vehicleIdMap.get(o.vehicleId);
      if (newVehicleId) {
        await db.insert(odometerReadings).values({
          id: crypto.randomUUID(),
          vehicleId: newVehicleId,
          reading: o.reading,
          date: o.date,
          notes: o.notes || "",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Salin Components
    const componentIdMap = new Map<string, string>();
    for (const c of seed.components) {
      const newVehicleId = vehicleIdMap.get(c.vehicleId);
      if (newVehicleId) {
        const newComponentId = crypto.randomUUID();
        componentIdMap.set(c.id, newComponentId);

        await db.insert(components).values({
          id: newComponentId,
          vehicleId: newVehicleId,
          name: c.name,
          intervalKm: c.intervalKm,
          lastReplacedOdo: c.lastReplacedOdo ?? 0,
          notes: c.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Salin Fuel Logs
    for (const f of seed.fuelLogs) {
      const newVehicleId = vehicleIdMap.get(f.vehicleId);
      if (newVehicleId) {
        await db.insert(fuelLogs).values({
          id: crypto.randomUUID(),
          vehicleId: newVehicleId,
          date: f.date,
          liters: f.liters,
          amount: f.amount,
          fuelType: f.fuelType,
          odoReading: f.odoReading ?? 0,
          isFull: f.isFull ?? false,
          kmPerLiter: f.kmPerLiter ?? null,
          notes: f.notes || "",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Salin Maintenance Records
    for (const m of seed.maintenanceRecords) {
      const newVehicleId = vehicleIdMap.get(m.vehicleId);
      const newComponentId = m.componentId ? componentIdMap.get(m.componentId) : null;
      if (newVehicleId) {
        await db.insert(maintenanceRecords).values({
          id: crypto.randomUUID(),
          vehicleId: newVehicleId,
          componentId: newComponentId,
          date: m.date,
          description: m.description,
          cost: m.cost ?? 0,
          odoReading: m.odoReading ?? 0,
          notes: m.notes || "",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 4. Buat response dan teruskan header cookie autentikasi yang sah ke browser
    const response = NextResponse.json({ success: true });
    
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
