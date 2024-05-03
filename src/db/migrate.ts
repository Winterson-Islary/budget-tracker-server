import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, client } from "./db";

await migrate(db, { migrationsFolder: "./src/db/migrations" });

await client.end();
