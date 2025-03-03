import type { FastifyInstance } from "fastify";
import { createAppointmentRoute } from "./create-appointment";
import { createDoctorRoute } from "./create-doctor";
import { createSlotRoute } from "./create-slot";
import { getAvailableSlotsRoute } from "./get-available-slots";
import { getBookedSlotsRoute } from "./get-booked-slots";

export async function routes(app: FastifyInstance) {
	app.register(createDoctorRoute);
	app.register(createSlotRoute);
	app.register(getAvailableSlotsRoute);
	app.register(createAppointmentRoute);
	app.register(getBookedSlotsRoute);
}
