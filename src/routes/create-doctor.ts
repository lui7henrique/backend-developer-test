import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createDoctorSchema, doctors } from "../drizzle/schema/doctors";
import { createDoctor } from "../functions/create-doctor";

const createDoctorResponse = {
	201: z.object({
		doctor: createSelectSchema(doctors),
	}),
};

export const createDoctorRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/doctors",
		{
			schema: {
				operationId: "createDoctor",
				description: "Create a doctor",
				body: createDoctorSchema,
				response: createDoctorResponse,
			},
		},
		async (request, reply) => {
			const response = await createDoctor(request.body);
			return reply.status(201).send(response);
		},
	);
};
