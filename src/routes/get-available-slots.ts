import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getAvailableSlots } from "../functions/get-slots";

export const getAvailableSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/available_slots",
		{
			schema: {
				params: z.object({
					doctorId: z.string(),
				}),
				response: {
					200: z.object({
						availableSlots: z.array(createSelectSchema(slots)),
					}),
				},
			},
		},
		async (request, reply) => {
			const response = await getAvailableSlots(request.params);
			return reply.status(200).send(response);
		},
	);
};
