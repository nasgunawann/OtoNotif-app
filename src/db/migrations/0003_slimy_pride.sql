ALTER TABLE "vehicles" ALTER COLUMN "engine" DROP DEFAULT;
ALTER TABLE "vehicles" ALTER COLUMN "engine" SET DATA TYPE integer USING (CASE WHEN engine = '' OR engine IS NULL THEN '0' ELSE engine END)::integer;
ALTER TABLE "vehicles" ALTER COLUMN "engine" SET DEFAULT 0;