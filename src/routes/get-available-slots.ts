import { addDays } from "date-fns";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getAvailableSlots } from "../functions/get-slots";

const getAvailableSlotsSchema = z.object({
	doctorId: z.string(),
});

const getAvailableSlotsQuerySchema = z.object({
	startDate: z.coerce.date().default(new Date()),
	endDate: z.coerce.date().default(addDays(new Date(), 1)),
});

export const getAvailableSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/available_slots",
		{
			schema: {
				params: getAvailableSlotsSchema,
				querystring: getAvailableSlotsQuerySchema,
			},
		},
		async (request, reply) => {
			const response = await getAvailableSlots({
				...request.params,
				...request.query,
			});

			return reply.status(200).send(response);
		},
	);
};
