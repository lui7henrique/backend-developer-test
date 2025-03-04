import { db } from "../drizzle/client";
import { doctors } from "../drizzle/schema/doctors";

export async function getDoctors() {
	return await db.select().from(doctors);
}
