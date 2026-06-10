import { pgTable, text, integer, boolean, doublePrecision, timestamp, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const vehicles = pgTable("vehicles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
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
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  reading: integer("reading").notNull(),
  date: text("date").notNull(),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  vehicleIdx: index("idx_odometer_vehicle").on(table.vehicleId),
}));

export const fuelLogs = pgTable("fuel_logs", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  liters: doublePrecision("liters").notNull(),
  amount: doublePrecision("amount").notNull(),
  fuelType: text("fuel_type").notNull(),
  odoReading: integer("odo_reading").default(0),
  isFull: boolean("is_full").default(false),
  kmPerLiter: doublePrecision("km_per_liter"),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  vehicleIdx: index("idx_fuel_vehicle").on(table.vehicleId),
}));

export const components = pgTable("components", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  intervalKm: integer("interval_km").notNull(),
  lastReplacedOdo: integer("last_replaced_odo").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  vehicleIdx: index("idx_components_vehicle").on(table.vehicleId),
}));

export const maintenanceRecords = pgTable("maintenance_records", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  componentId: text("component_id").references(() => components.id, { onDelete: "set null" }),
  date: text("date").notNull(),
  description: text("description").notNull(),
  cost: doublePrecision("cost").default(0),
  odoReading: integer("odo_reading").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  vehicleIdx: index("idx_maintenance_vehicle").on(table.vehicleId),
}));
