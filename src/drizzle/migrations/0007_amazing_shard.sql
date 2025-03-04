ALTER TABLE "slots" ALTER COLUMN "recurrence_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "start_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "end_time" timestamp NOT NULL;