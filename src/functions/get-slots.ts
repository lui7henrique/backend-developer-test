import { addDays, differenceInDays, isBefore, startOfDay } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { appointments } from "../drizzle/schema/appointments";
import { slots } from "../drizzle/schema/slots";

type GetAvailableSlotsParams = {
	doctorId: string;
	startDate: Date;
	endDate: Date;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
	const { doctorId, startDate, endDate } = params;

	const allSlots = await db
		.select()
		.from(slots)
		.where(and(eq(slots.doctorId, doctorId)));

	const allAppointments = await db
		.select()
		.from(appointments)
		.where(and(eq(appointments.doctorId, doctorId)));

	const totalDays = differenceInDays(endDate, startDate) + 1;

	const generatedSlots = Array.from({ length: totalDays }, (_, dayIndex) => {
		const currentDate = addDays(startDate, dayIndex);

		// Skip past dates
		if (isBefore(currentDate, startOfDay(new Date()))) {
			return { date: currentDate.toISOString().slice(0, 10), slots: [] };
		}

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

				const isSlotBooked = allAppointments.some(
					(appointment) =>
						appointment.slotId === slot.id &&
						appointment.startTime.toISOString() ===
							adjustedStartTime.toISOString() &&
						appointment.endTime.toISOString() === adjustedEndTime.toISOString(),
				);

				if (isSlotBooked) {
					return [];
				}

				return {
					...slot,
					startTime: adjustedStartTime.toISOString(),
					endTime: adjustedEndTime.toISOString(),
				};
			}

			return [];
		});

		return {
			date: currentDate.toISOString().slice(0, 10),
			slots: slotsForCurrentDay,
		};
	});

	return { availableSlots: generatedSlots };
};
