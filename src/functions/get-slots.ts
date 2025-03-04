import { addDays, differenceInDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { slots } from "../drizzle/schema/slots";

type GetAvailableSlotsParams = {
	doctorId: string;
	startDate: Date;
	endDate: Date;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
	const { doctorId, startDate, endDate } = params;

	// Fetch all slots for the given doctor
	const allSlots = await db
		.select()
		.from(slots)
		.where(and(eq(slots.doctorId, doctorId)));

	// Calculate the number of days between startDate and endDate
	const totalDays = differenceInDays(endDate, startDate);

	// Generate slots for each day in the range
	const generatedSlots = Array.from({ length: totalDays }, (_, dayIndex) => {
		const currentDate = addDays(startDate, dayIndex);

		// Filter and adjust slots for the current date
		const slotsForCurrentDay = allSlots.flatMap((slot) => {
			const slotStartTime = new Date(slot.startTime);
			const slotEndTime = new Date(slot.endTime);

			// Determine if the slot is applicable for the current date
			const isSlotForToday =
				slotStartTime.toISOString().slice(0, 10) ===
				currentDate.toISOString().slice(0, 10);

			const isSlotRecurring =
				slot.recurrenceType !== "NONE" &&
				(slot.recurrenceType === "DAILY" ||
					(slot.recurrenceType === "WEEKLY" &&
						slotStartTime.getUTCDay() === currentDate.getUTCDay()) ||
					(slot.recurrenceType === "MONTHLY" &&
						slotStartTime.getUTCDate() === currentDate.getUTCDate()));

			if (isSlotForToday || isSlotRecurring) {
				// Adjust the slot times to the current date
				const adjustedStartTime = new Date(currentDate);
				adjustedStartTime.setUTCHours(
					slotStartTime.getUTCHours(),
					slotStartTime.getUTCMinutes(),
					slotStartTime.getUTCSeconds(),
				);

				const adjustedEndTime = new Date(currentDate);
				adjustedEndTime.setUTCHours(
					slotEndTime.getUTCHours(),
					slotEndTime.getUTCMinutes(),
					slotEndTime.getUTCSeconds(),
				);

				return {
					...slot,
					startTime: adjustedStartTime.toISOString(),
					endTime: adjustedEndTime.toISOString(),
				};
			}

			return [];
		});

		return {
			date: currentDate.toISOString().slice(0, 10), // Ensure date is in YYYY-MM-DD format
			slots: slotsForCurrentDay,
		};
	});

	return { availableSlots: generatedSlots };
};
