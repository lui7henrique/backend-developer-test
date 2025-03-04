import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAppointment } from "../functions/create-appointment";

export const createAppointmentBodySchema = z.object({
	startTime: z.coerce.date(),
	endTime: z.coerce.date(),
	patientEmail: z.string().email(),
});

export const createAppointmentParamsSchema = z.object({
	slotId: z.string(),
});

export const createAppointmentRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/slots/:slotId/book",
		{
			schema: {
				operationId: "createAppointment",
				description: "Create an appointment",
				params: createAppointmentParamsSchema,
				body: createAppointmentBodySchema,
			},
		},
		async (request, reply) => {
			const response = await createAppointment({
				...request.params,
				...request.body,
			});

			return reply.status(201).send(response);
		},
	);
};
