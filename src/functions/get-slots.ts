import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { slots as slotsSchema } from "../drizzle/schema/slots";

type GetSlotsParams = {
	doctorId: string;
};

export const getSlots = async (params: GetSlotsParams) => {
	const { doctorId } = params;

	const slots = await db
		.select()
		.from(slotsSchema)
		.where(eq(slotsSchema.doctorId, doctorId));

	return { slots: slots };
};
