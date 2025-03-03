import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createDoctorSchema } from "../drizzle/schema/doctors";
import { createDoctor } from "../functions/create-doctor";

export const createDoctorRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/doctors",
		{
			schema: {
				body: createDoctorSchema,
			},
		},
		async (request, reply) => {
			const body = request.body;

			const response = await createDoctor(body);

			return reply.status(201).send(response);
		},
	);
};
