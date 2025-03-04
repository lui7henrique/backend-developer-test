import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { doctors } from "../drizzle/schema/doctors";
import { getDoctorById } from "../functions/get-doctor-by-id";

const getDoctorByIdParams = z.object({
	id: z.string().uuid(),
});

const getDoctorByIdResponse = {
	200: z.object({
		doctor: createSelectSchema(doctors),
	}),
	404: z.object({
		message: z.string(),
	}),
};

export const getDoctorByIdRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:id",
		{
			schema: {
				summary: "Get doctor by ID",
				description: "Get a doctor by their ID",
				operationId: "getDoctorById",
				params: getDoctorByIdParams,
				response: getDoctorByIdResponse,
			},
		},
		async (request, reply) => {
			const response = await getDoctorById(request.params.id);

			if (!response) {
				return reply.status(404).send({ message: "Doctor not found" });
			}

			return reply.status(200).send(response);
		},
	);
};
