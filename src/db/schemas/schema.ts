import { sql } from "drizzle-orm";
import {
	index,
	integer,
	numeric,
	pgTable,
	serial,
	text,
	time,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("userSettings", {
	userId: text("userId").primaryKey(),
	currency: text("currency"),
});

export const category = pgTable("category", {
	createdAt: timestamp("createdAt").defaultNow(),
	name: text("name").unique(),
	userId: text("userId").unique(),
	icon: text("icon"),
	type: text("type").default("income"),
});

export const transaction = pgTable(
	"transaction",
	{
		id: serial("id").primaryKey(),
		createdAt: timestamp("createdAt").defaultNow(),
		updatedAt: timestamp("updateAt").defaultNow(),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		description: text("description"),
		date: time("date"),
		userId: text("userId").notNull(),
		category: text("category"),
		categoryIcon: text("categoryIcon"),
	},
	(transaction) => {
		return {
			userIdIndex: index("name_idx").on(transaction.userId),
		};
	},
);

export const monthHistory = pgTable("monthHistory", {
	userId: text("userId").notNull().primaryKey(),
	day: integer("day").notNull().primaryKey(),
	month: integer("month").notNull().primaryKey(),
	year: integer("year").notNull().primaryKey(),
	income: numeric("income", { precision: 12, scale: 2 }).notNull(),
	expense: numeric("expense", { precision: 12, scale: 2 }).notNull(),
});

export const yearHistory = pgTable("yearHistory", {
	userId: text("userId").notNull().primaryKey(),
	month: integer("month").notNull().primaryKey(),
	year: integer("year").notNull().primaryKey(),
	income: numeric("income", { precision: 12, scale: 2 }).notNull(),
	expense: numeric("expense", { precision: 12, scale: 2 }).notNull(),
});
