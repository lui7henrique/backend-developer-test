import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getBookedSlots } from "../functions/get-booked-slots";

const getBookedSlotsParamsSchema = z.object({
	doctorId: z.string(),
});

export type GetBookedSlotsParams = z.infer<typeof getBookedSlotsParamsSchema>;

const getBookedSlotsResponse = {
	200: z.object({
		bookedSlots: z.array(
			createSelectSchema(slots).extend({
				appointmentId: z.string(),
				patientEmail: z.string(),
			}),
		),
	}),
};

export const getBookedSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/booked",
		{
			schema: {
				operationId: "getBookedSlots",
				description: "Get all booked slots for a doctor",
				params: getBookedSlotsParamsSchema,
				response: getBookedSlotsResponse,
				summary: "Get all booked slots",
			},
		},
		async (request, reply) => {
			const response = await getBookedSlots(request.params);
			return reply.status(200).send(response);
		},
	);
};
