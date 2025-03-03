import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAppointment } from "../functions/create-appointment";

export const createAppointmentSchema = z.object({
	slotId: z.string(),
});

export const createAppointmentRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/appointments",
		{
			schema: {
				body: createAppointmentSchema,
			},
		},
		async (request, reply) => {
			console.log(request.body);
			const response = await createAppointment(request.body);

			return reply.status(201).send(response);
		},
	);
};
