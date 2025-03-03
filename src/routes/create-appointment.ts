import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAppointment } from "../functions/create-appointment";

export const createAppointmentSchema = z.object({
	slotId: z.string(),
});

export const createAppointmentRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots/:slotId/book",
		{
			schema: {
				params: createAppointmentSchema,
			},
		},
		async (request, reply) => {
			const response = await createAppointment(request.params);

			return reply.status(201).send(response);
		},
	);
};
