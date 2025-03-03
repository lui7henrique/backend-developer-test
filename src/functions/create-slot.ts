import { db } from "../drizzle/client";
import { type CreateSlotSchema, slots } from "../drizzle/schema/slots";

export async function createSlot(slot: CreateSlotSchema) {
	const newSlot = await db.insert(slots).values(slot).returning();

	return newSlot;
}
