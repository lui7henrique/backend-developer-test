import { and, eq, gt, isNull, not } from "drizzle-orm";
import { db } from "../drizzle/client";
import { appointments } from "../drizzle/schema/appointments";
import { slots } from "../drizzle/schema/slots";

type GetAvailableSlotsParams = {
	doctorId: string;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
	const { doctorId } = params;

	const allSlots = await db
		.select()
		.from(slots)
		.where(and(eq(slots.doctorId, doctorId), gt(slots.startTime, new Date())));

	const bookedSlotIds = (
		await db
			.select({ slotId: appointments.slotId })
			.from(appointments)
			.where(eq(appointments.doctorId, doctorId))
	).map((row) => row.slotId);

	const availableSlots = allSlots.filter(
		(slot) => !bookedSlotIds.includes(slot.id),
	);

	return { availableSlots };
};
