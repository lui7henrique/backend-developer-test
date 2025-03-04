import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSlotSchema, slots } from "../drizzle/schema/slots";
import { createSlot } from "../functions/create-slot";

const createSlotResponse = {
	201: z.object({
		newSlots: z.array(createSelectSchema(slots)),
	}),
};

export const createSlotRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots",
		{
			schema: {
				description: "Create a slot",
				body: createSlotSchema,
				response: createSlotResponse,
			},
		},
		async (request, reply) => {
			const response = await createSlot(request.body);
			return reply.status(201).send(response);
		},
	);
};
