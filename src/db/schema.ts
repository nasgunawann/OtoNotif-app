import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["motor", "mobil"] }).notNull(),
  image: text("image").notNull().default(""),
  engine: text("engine").notNull().default(""),
  fuelCapacity: real("fuel_capacity").notNull().default(0),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  taxDueDate: text("tax_due_date"),
  taxReminderDays: integer("tax_reminder_days").default(30),
  taxAmount: real("tax_amount").default(0),
  lastTaxPaidDate: text("last_tax_paid_date"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const odometerReadings = sqliteTable("odometer_readings", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  reading: integer("reading").notNull(),
  date: text("date").notNull(),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});

export const fuelLogs = sqliteTable("fuel_logs", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  date: text("date").notNull(),
  liters: real("liters").notNull(),
  amount: real("amount").notNull(),
  fuelType: text("fuel_type").notNull(),
  odoReading: integer("odo_reading").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});

export const components = sqliteTable("components", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  name: text("name").notNull(),
  intervalKm: integer("interval_km").notNull(),
  lastReplacedOdo: integer("last_replaced_odo").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const maintenanceRecords = sqliteTable("maintenance_records", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  componentId: text("component_id").references(() => components.id),
  date: text("date").notNull(),
  description: text("description").notNull(),
  cost: real("cost").default(0),
  odoReading: integer("odo_reading").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});
