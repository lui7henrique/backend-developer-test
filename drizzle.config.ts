import type { Config } from "drizzle-kit";
import { env } from "./src/env";
console.log({ env });

export default {
	schema: "./src/drizzle/schema/*",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.POSTGRES_URL,
	},
} satisfies Config;
