import { addDays } from "date-fns";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
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

export const getAvailableSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/available_slots",
		{
			schema: {
				description: "Get all available slots for a doctor",
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
