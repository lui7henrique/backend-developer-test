import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { appointments } from "../drizzle/schema/appointments";
import { slots } from "../drizzle/schema/slots";
import type { GetBookedSlotsParams } from "../routes/get-booked-slots";

export const getBookedSlots = async ({ doctorId }: GetBookedSlotsParams) => {
	const doctorAppointments = await db
		.select({
			appointment: appointments,
			slot: slots,
		})
		.from(appointments)
		.innerJoin(slots, eq(appointments.slotId, slots.id))
		.where(eq(appointments.doctorId, doctorId));

	const bookedSlots = doctorAppointments.map(({ appointment, slot }) => ({
		id: slot.id,
		doctorId: slot.doctorId,
		startTime: slot.startTime,
		endTime: slot.endTime,
		appointmentId: appointment.id,
	}));

	return { bookedSlots };
};
