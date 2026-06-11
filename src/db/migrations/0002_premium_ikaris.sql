ALTER TABLE "components" DROP CONSTRAINT "components_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "fuel_logs" DROP CONSTRAINT "fuel_logs_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "maintenance_records" DROP CONSTRAINT "maintenance_records_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "maintenance_records" DROP CONSTRAINT "maintenance_records_component_id_components_id_fk";
--> statement-breakpoint
ALTER TABLE "odometer_readings" DROP CONSTRAINT "odometer_readings_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "odometer_readings" ADD CONSTRAINT "odometer_readings_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;