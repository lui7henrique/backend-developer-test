import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { doctors } from "./doctors";
import { slots } from "./slots";

export const appointments = pgTable("appointments", {
	id: uuid("id").primaryKey().defaultRandom(),
	slotId: uuid("slot_id")
		.references(() => slots.id)
		.notNull(),
	doctorId: uuid("doctor_id")
		.references(() => doctors.id)
		.notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createAppointmentSchema = createInsertSchema(appointments)
	.omit({
		id: true,
		createdAt: true,
	})
	.extend({
		slotId: z.string(),
	});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
