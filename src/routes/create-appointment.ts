import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAppointment } from "../functions/create-appointment";

export const createAppointmentSchema = z.object({
	slotId: z.string(),
	patientName: z.string().min(1).optional(),
	patientEmail: z.string().email().optional(),
});

export const createAppointmentRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots/:slotId/book",
		{
			schema: {
				params: z.object({
					slotId: z.string(),
				}),
				body: z.object({
					patientName: z.string().min(1).optional(),
					patientEmail: z.string().email().optional(),
				}),
			},
		},
		async (request, reply) => {
			const { slotId } = request.params;

			const response = await createAppointment({
				slotId,
			});

			return reply.status(201).send(response);
		},
	);
};
