import type { FastifyInstance } from "fastify";
import { createDoctorRoute } from "./create-doctor";
import { createSlotRoute } from "./create-slot";

export async function routes(app: FastifyInstance) {
	app.register(createDoctorRoute);
	app.register(createSlotRoute);
}
