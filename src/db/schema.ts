import { pgTable, text, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  image: text("image").notNull().default(""),
  engine: text("engine").notNull().default(""),
  fuelCapacity: doublePrecision("fuel_capacity").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
  taxDueDate: text("tax_due_date"),
  taxReminderDays: integer("tax_reminder_days").default(30),
  taxIntervalYears: integer("tax_interval_years").default(1),
  taxAmount: doublePrecision("tax_amount").default(0),
  lastTaxPaidDate: text("last_tax_paid_date"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const odometerReadings = pgTable("odometer_readings", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  reading: integer("reading").notNull(),
  date: text("date").notNull(),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});

export const fuelLogs = pgTable("fuel_logs", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  date: text("date").notNull(),
  liters: doublePrecision("liters").notNull(),
  amount: doublePrecision("amount").notNull(),
  fuelType: text("fuel_type").notNull(),
  odoReading: integer("odo_reading").default(0),
  isFull: boolean("is_full").default(false),
  kmPerLiter: doublePrecision("km_per_liter"),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});

export const components = pgTable("components", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  name: text("name").notNull(),
  intervalKm: integer("interval_km").notNull(),
  lastReplacedOdo: integer("last_replaced_odo").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const maintenanceRecords = pgTable("maintenance_records", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  componentId: text("component_id").references(() => components.id),
  date: text("date").notNull(),
  description: text("description").notNull(),
  cost: doublePrecision("cost").default(0),
  odoReading: integer("odo_reading").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
});
