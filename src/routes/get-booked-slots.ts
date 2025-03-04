import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { slots } from "../drizzle/schema/slots";
import { getBookedSlots } from "../functions/get-booked-slots";

const getBookedSlotsParamsSchema = z.object({
	doctorId: z.string(),
});

export type GetBookedSlotsParams = z.infer<typeof getBookedSlotsParamsSchema>;

export const getBookedSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/doctors/:doctorId/booked",
		{
			schema: {
				params: getBookedSlotsParamsSchema,
				response: {
					200: z.object({
						bookedSlots: z.array(
							createSelectSchema(slots).extend({
								appointmentId: z.string(),
							}),
						),
					}),
				},
			},
		},
		async (request, reply) => {
			const { doctorId } = request.params;
			const response = await getBookedSlots({ doctorId });

			return reply.status(200).send(response);
		},
	);
};
