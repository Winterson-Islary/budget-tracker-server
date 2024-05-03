import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { userConfig } from "../utils/config";
import * as schema from "./schemas/schema";
// const client = new Client({
// 	host: Config.Get("db_host"),
// 	user: Config.Get("db_user"),
// 	password: Config.Get("db_password"),
// 	database: Config.Get("db_name"),
// });

export const client = new Client({
	connectionString: userConfig.Get("db_url"),
});
await client.connect();
export const db = drizzle(client, { schema });
