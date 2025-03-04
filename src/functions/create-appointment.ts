import { and, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "../drizzle/client";
import { appointments } from "../drizzle/schema/appointments";
import { slots } from "../drizzle/schema/slots";
import type { createAppointmentSchema } from "../routes/create-appointment";

export const createAppointment = async ({
	slotId,
	startTime,
	endTime,
}: z.infer<typeof createAppointmentSchema>) => {
	const [slot] = await db.select().from(slots).where(eq(slots.id, slotId));

	if (!slot) {
		throw new Error("Slot not found");
	}

	if (startTime < new Date()) {
		throw new Error("Slot is in the past");
	}

	const [existingAppointment] = await db
		.select()
		.from(appointments)
		.where(
			and(
				eq(appointments.slotId, slotId),
				eq(appointments.startTime, startTime),
				eq(appointments.endTime, endTime),
			),
		);

	if (existingAppointment) {
		throw new Error("Slot already booked");
	}

	const [appointment] = await db
		.insert(appointments)
		.values({
			slotId,
			doctorId: slot.doctorId,
			startTime: startTime,
			endTime: endTime,
		})
		.returning();

	return { appointment };
};
