import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { doctors } from "../drizzle/schema/doctors";

export async function getDoctorById(id: string) {
	const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));

	return {
		doctor: doctor || null,
	};
}
