CREATE TYPE "public"."recurrence_type" AS ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "end_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "recurrence_type" "recurrence_type" DEFAULT 'NONE';--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;