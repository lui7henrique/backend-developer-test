import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { doctors } from "./doctors";

export const recurrenceType = pgEnum("recurrence_type", [
	"NONE",
	"DAILY",
	"WEEKLY",
	"MONTHLY",
]);

export const slots = pgTable("slots", {
	id: uuid("id").primaryKey().defaultRandom(),
	doctorId: uuid("doctor_id")
		.references(() => doctors.id)
		.notNull(),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	endTime: timestamp("end_time", { withTimezone: true }).notNull(),
	startDate: timestamp("start_date", { withTimezone: true }),
	endDate: timestamp("end_date", { withTimezone: true }),
	recurrenceType: recurrenceType("recurrence_type").default("NONE").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const createSlotSchema = createInsertSchema(slots)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		startDate: true,
		endDate: true,
	})
	.extend({
		startTime: z.coerce.date(),
		endTime: z.coerce.date(),
	});

export type CreateSlotSchema = z.infer<typeof createSlotSchema>;
export type Slot = typeof slots.$inferSelect;
