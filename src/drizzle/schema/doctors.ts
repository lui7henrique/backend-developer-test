import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const doctors = pgTable("doctors", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: text("username").notNull().unique(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createDoctorSchema = createInsertSchema(doctors).omit({
	id: true,
	createdAt: true,
});

export type CreateDoctorSchema = z.infer<typeof createDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
