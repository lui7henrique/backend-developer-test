import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createSlotSchema } from "../drizzle/schema/slots";
import { createSlot } from "../functions/create-slot";

export const createSlotRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots",
		{
			schema: {
				body: createSlotSchema,
			},
		},
		async (request, reply) => {
			const { doctorId, startTime, endTime } = request.body;

			const response = await createSlot({
				doctorId,
				startTime,
				endTime,
			});

			return reply.status(201).send(response);
		},
	);
};
