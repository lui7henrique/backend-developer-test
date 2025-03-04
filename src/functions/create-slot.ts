import { isSameDay } from "date-fns";
import { db } from "../drizzle/client";
import { type CreateSlotSchema, slots } from "../drizzle/schema/slots";

const SLOTS_DURATION = 30 * 60 * 1000;

export async function createSlot(slot: CreateSlotSchema) {
	if (!isSameDay(slot.startTime, slot.endTime)) {
		throw new Error("Start and end time must be on the same day");
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
			...slot,
			doctorId: slot.doctorId,
			startTime: currentStartTime,
			endTime: slotEnd,
		});

		currentStartTime = slotEnd;
	}

	const newSlots = await db.insert(slots).values(slotsToCreate).returning();

	return { newSlots };
}
