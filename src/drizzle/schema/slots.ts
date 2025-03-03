import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { doctors } from "./doctors";

const slotStatus = pgEnum("slot_status", ["available", "booked"]);

export const slots = pgTable("slots", {
	id: uuid("id").primaryKey().defaultRandom(),
	doctorId: uuid("doctor_id")
		.references(() => doctors.id)
		.notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	status: slotStatus("status").default("available").notNull(),
});

export const createSlotSchema = createInsertSchema(slots).omit({
	id: true,
});

export type CreateSlotSchema = z.infer<typeof createSlotSchema>;

export type Slot = typeof slots.$inferSelect;
