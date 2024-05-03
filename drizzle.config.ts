import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schemas/schema.ts",
	out: "./src/db/migrations",
	driver: "pg",
} satisfies Config;
