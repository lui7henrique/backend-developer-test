import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { doctors } from "./doctors";

export const slots = pgTable("slots", {
	id: uuid("id").primaryKey().defaultRandom(),
	doctorId: uuid("doctor_id")
		.references(() => doctors.id)
		.notNull(),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	endTime: timestamp("end_time", { withTimezone: true }).notNull(),
});

export const createSlotSchema = createInsertSchema(slots)
	.omit({
		id: true,
	})
	.extend({
		startTime: z.coerce.date(),
		endTime: z.coerce.date(),
	});

export type CreateSlotSchema = z.infer<typeof createSlotSchema>;
export type Slot = typeof slots.$inferSelect;
