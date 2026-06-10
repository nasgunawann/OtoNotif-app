CREATE TABLE "components" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"name" text NOT NULL,
	"interval_km" integer NOT NULL,
	"last_replaced_odo" integer DEFAULT 0,
	"notes" text DEFAULT '',
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fuel_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"date" text NOT NULL,
	"liters" double precision NOT NULL,
	"amount" double precision NOT NULL,
	"fuel_type" text NOT NULL,
	"odo_reading" integer DEFAULT 0,
	"is_full" boolean DEFAULT false,
	"km_per_liter" double precision,
	"notes" text DEFAULT '',
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_records" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"component_id" text,
	"date" text NOT NULL,
	"description" text NOT NULL,
	"cost" double precision DEFAULT 0,
	"odo_reading" integer DEFAULT 0,
	"notes" text DEFAULT '',
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "odometer_readings" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"reading" integer NOT NULL,
	"date" text NOT NULL,
	"notes" text DEFAULT '',
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"engine" text DEFAULT '' NOT NULL,
	"fuel_capacity" double precision DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"tax_due_date" text,
	"tax_reminder_days" integer DEFAULT 30,
	"tax_interval_years" integer DEFAULT 1,
	"tax_amount" double precision DEFAULT 0,
	"last_tax_paid_date" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "odometer_readings" ADD CONSTRAINT "odometer_readings_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;