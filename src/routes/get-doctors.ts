import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { doctors } from "../drizzle/schema/doctors";
import { getDoctors } from "../functions/get-doctors";

const getDoctorsResponse = {
	200: z.array(createSelectSchema(doctors)),
};

export const getDoctorsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors",
		{
			schema: {
				summary: "Get a list of all available doctors",
				description: "Get all doctors",
				operationId: "getDoctors",
				response: getDoctorsResponse,
			},
		},
		async (_request, reply) => {
			const response = await getDoctors();
			return reply.status(200).send(response);
		},
	);
};
