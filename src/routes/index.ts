import type { FastifyInstance } from "fastify";
import { createDoctorRoute } from "./create-doctor";

export async function routes(app: FastifyInstance) {
	app.register(createDoctorRoute);
}
