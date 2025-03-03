import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { slots } from "../drizzle/schema/slots";
import type { GetBookedSlotsParams } from "../routes/get-booked-slots";

export const getBookedSlots = async ({ doctorId }: GetBookedSlotsParams) => {
	const bookedSlots = await db
		.select()
		.from(slots)
		.where(and(eq(slots.doctorId, doctorId), eq(slots.status, "booked")));

	return { bookedSlots };
};
