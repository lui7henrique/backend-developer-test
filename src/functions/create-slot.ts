import { and, between, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { type CreateSlotSchema, slots } from "../drizzle/schema/slots";

const SLOTS_DURATION = 30 * 60 * 1000;

export async function createSlot(slot: CreateSlotSchema) {
	const overlappingSlot = await db
		.select()
		.from(slots)
		.where(
			and(
				eq(slots.doctorId, slot.doctorId),
				between(slots.startTime, slot.startTime, slot.endTime),
			),
		);

	if (overlappingSlot.length > 0) {
		throw new Error("Overlapping slots exist for this doctor");
	}

	const slotsToCreate = [];
	let currentStartTime = slot.startTime;
	const endTime = new Date(slot.endTime);

	while (currentStartTime < endTime) {
		const slotEnd = new Date(currentStartTime.getTime() + SLOTS_DURATION);

		if (slotEnd > endTime) {
			break;
		}

		slotsToCreate.push({
			doctorId: slot.doctorId,
			startTime: currentStartTime,
			endTime: slotEnd,
		});

		currentStartTime = slotEnd;
	}

	const newSlots = await db.insert(slots).values(slotsToCreate).returning();

	return { newSlots };
}
