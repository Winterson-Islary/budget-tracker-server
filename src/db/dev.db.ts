import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

console.log("Initializing DEV Database.");
const sqlite = new Database("sqlite.db");
const dev_db = drizzle(sqlite);

export const DEV_DB = dev_db;

// DEV SCHEMAS

import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable("users", {
	id: text("id"),
	textModifiers: text("text_modifiers")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	intModifiers: integer("int_modifiers", { mode: "boolean" })
		.notNull()
		.default(false),
});
