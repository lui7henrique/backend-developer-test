import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getSlots } from "../functions/get-slots";

export const getSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/slots/:doctorId",
		{
			schema: {
				params: z.object({
					doctorId: z.string(),
				}),
				response: {
					200: z.object({
						slots: z.array(createSelectSchema(slots)),
					}),
				},
			},
		},
		async (request, reply) => {
			const response = await getSlots(request.params);
			return reply.status(200).send(response);
		},
	);
};
