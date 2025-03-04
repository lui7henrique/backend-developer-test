import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../drizzle/client";
import { appointments } from "../drizzle/schema/appointments";
import { slots } from "../drizzle/schema/slots";
import type { GetBookedSlotsParams } from "../routes/get-booked-slots";

export const getBookedSlots = async ({ doctorId }: GetBookedSlotsParams) => {
	const bookedSlots = await db
		.select({
			...getTableColumns(slots),
			appointmentId: appointments.id,
			patientEmail: appointments.patientEmail,
			startTime: appointments.startTime,
			endTime: appointments.endTime,
		})
		.from(appointments)
		.innerJoin(slots, eq(appointments.slotId, slots.id))
		.where(eq(appointments.doctorId, doctorId));

	return { bookedSlots };
};
