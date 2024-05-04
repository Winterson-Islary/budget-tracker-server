import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const conString: string = process.env.DB_URL || "";

export default {
	schema: "./src/db/schemas/schema.ts",
	out: "./src/db/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: conString,
	},
} satisfies Config;
