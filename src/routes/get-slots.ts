import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getSlotsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/slots", async (request, reply) => {
		return reply.status(200).send({ message: "Hello, world!" });
	});
};
