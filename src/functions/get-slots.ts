import { and, eq, gt } from "drizzle-orm";
import { db } from "../drizzle/client";
import { slots } from "../drizzle/schema/slots";

type GetAvailableSlotsParams = {
	doctorId: string;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
	const { doctorId } = params;

	const availableSlots = await db
		.select()
		.from(slots)
		.where(
			and(
				eq(slots.doctorId, doctorId),
				eq(slots.status, "available"),
				gt(slots.startTime, new Date()),
			),
		);

	return { availableSlots: availableSlots };
};
