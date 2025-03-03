CREATE TYPE "public"."slot_status" AS ENUM('available', 'booked');--> statement-breakpoint
CREATE TABLE "slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" "slot_status" DEFAULT 'available' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slots" ADD CONSTRAINT "slots_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;