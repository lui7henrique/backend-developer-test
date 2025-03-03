import { db } from "../drizzle/client";
import { type CreateDoctorSchema, doctors } from "../drizzle/schema/doctors";

export async function createDoctor(values: CreateDoctorSchema) {
	const [doctor] = await db.insert(doctors).values(values).returning();

	return { doctor };
}
