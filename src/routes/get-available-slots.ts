import { addDays } from "date-fns";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getAvailableSlots } from "../functions/get-available-slots";

const getAvailableSlotsSchema = z.object({
	doctorId: z.string(),
});

const getAvailableSlotsQuerySchema = z.object({
	startDate: z
		.string()
		.default(new Date().toISOString())
		.transform((date) => new Date(date))
		.pipe(z.date()),
	endDate: z
		.string()
		.default(addDays(new Date(), 7).toISOString())
		.transform((date) => new Date(date))
		.pipe(z.date()),
});

const getAvailableSlotsResponse = {
	200: z.object({
		availableSlots: z.array(
			z.object({
				date: z.string(),
				slots: z.array(
					createSelectSchema(slots).extend({
						startTime: z.string(),
						endTime: z.string(),
					}),
				),
			}),
		),
	}),
};

export const getAvailableSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/available_slots",
		{
			schema: {
				operationId: "getAvailableSlots",
				description: "Get all available slots for a doctor",
				params: getAvailableSlotsSchema,
				querystring: getAvailableSlotsQuerySchema,
				response: getAvailableSlotsResponse,
				summary: "Get all available slots for booking appointments",
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
