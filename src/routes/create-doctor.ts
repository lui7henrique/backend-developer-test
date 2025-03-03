import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createDoctorSchema, doctors } from "../drizzle/schema/doctors";
import { createDoctor } from "../functions/create-doctor";

export const createDoctorRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/doctors",
		{
			schema: {
				body: createDoctorSchema,
				response: {
					201: z.object({
						doctor: createSelectSchema(doctors),
					}),
				},
			},
		},
		async (request, reply) => {
			const response = await createDoctor(request.body);
			return reply.status(201).send(response);
		},
	);
};
