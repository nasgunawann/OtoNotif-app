CREATE TABLE IF NOT EXISTS `components` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`name` text NOT NULL,
	`interval_km` integer NOT NULL,
	`last_replaced_odo` integer DEFAULT 0,
	`notes` text DEFAULT '',
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `fuel_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` text NOT NULL,
	`liters` real NOT NULL,
	`amount` real NOT NULL,
	`fuel_type` text NOT NULL,
	`odo_reading` integer DEFAULT 0,
	`notes` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `maintenance_records` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`component_id` text,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`cost` real DEFAULT 0,
	`odo_reading` integer DEFAULT 0,
	`notes` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`component_id`) REFERENCES `components`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `odometer_readings` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`reading` integer NOT NULL,
	`date` text NOT NULL,
	`notes` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`engine` text DEFAULT '' NOT NULL,
	`fuel_capacity` real DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`tax_due_date` text,
	`tax_reminder_days` integer DEFAULT 30,
	`tax_amount` real DEFAULT 0,
	`last_tax_paid_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
