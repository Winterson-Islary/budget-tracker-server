import {
	index,
	integer,
	numeric,
	pgTable,
	primaryKey,
	serial,
	text,
	time,
	timestamp,
} from "drizzle-orm/pg-core";

export const userSettings = pgTable("userSettings", {
	userId: text("userId").primaryKey(),
	currency: text("currency"),
});

export const category = pgTable("category", {
	createdAt: timestamp("createdAt").defaultNow(),
	name: text("name").primaryKey(),
	userId: text("userId"),
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
		type: text("type"),
		category: text("category"),
		categoryIcon: text("categoryIcon"),
	},
	(transaction) => {
		return {
			userIdIndex: index("name_idx").on(transaction.userId),
		};
	},
);

export const monthHistory = pgTable(
	"monthHistory",
	{
		userId: text("userId").notNull(),
		day: integer("day").notNull(),
		month: integer("month").notNull(),
		year: integer("year").notNull(),
		income: numeric("income", { precision: 12, scale: 2 }).notNull(),
		expense: numeric("expense", { precision: 12, scale: 2 }).notNull(),
	},
	(monthHistory) => {
		return {
			pk: primaryKey({
				columns: [
					monthHistory.userId,
					monthHistory.day,
					monthHistory.month,
					monthHistory.year,
				],
			}),
		};
	},
);

export const yearHistory = pgTable(
	"yearHistory",
	{
		userId: text("userId").notNull(),
		month: integer("month").notNull(),
		year: integer("year").notNull(),
		income: numeric("income", { precision: 12, scale: 2 }).notNull(),
		expense: numeric("expense", { precision: 12, scale: 2 }).notNull(),
	},
	(yearHistory) => {
		return {
			pk: primaryKey({
				columns: [yearHistory.month, yearHistory.year, yearHistory.userId],
			}),
		};
	},
);
