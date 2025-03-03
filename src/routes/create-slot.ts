import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSlotSchema, slots } from "../drizzle/schema/slots";
import { createSlot } from "../functions/create-slot";

export const createSlotRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots",
		{
			schema: {
				body: createSlotSchema,
				response: {
					201: z.object({
						newSlots: z.array(createSelectSchema(slots)),
					}),
				},
			},
		},
		async (request, reply) => {
			const response = await createSlot(request.body);
			return reply.status(201).send(response);
		},
	);
};
