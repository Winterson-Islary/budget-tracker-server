import { Hono } from "hono";
import { authMiddleware } from "../utils/authMiddleware";
import { and, eq } from "drizzle-orm";
import {
	category as categoryTable,
	transaction as transactionTable,
	monthHistory as monthHistoryTable,
	yearHistory as yearHistoryTable,
} from "../db/schemas/schema";
import { db } from "../db/db";
import { CreateTransactionSchema } from "../utils/types";

export const transactions = new Hono()
	.post("/", authMiddleware, async (ctx) => {
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";

		//! complete implementing transaction
		const { amount, category, date, description, type } = ctx.req.query();

		const categoryRow = await db.query.category.findFirst({
			where: and(
				eq(categoryTable.userId, userID),
				eq(categoryTable.name, category),
			),
		});
		if (!categoryRow) {
			return ctx.json({ error: "category not found" }, 400);
		}
		await db.transaction(async (tx) => {
			await tx.insert(transactionTable).values({
				userId: userID,
				amount,
				date,
				description: description || "",
				type,
				category: categoryRow.name,
				categoryIcon: categoryRow.icon,
			});
			await tx
				.insert(monthHistoryTable)
				.values({})
				.onConflictDoUpdate({
					setWhere: and(
						eq(monthHistoryTable.userId, userID),
						eq(day, date.getUTCDate()),
					),
				});
		});
	})
	.get("/", authMiddleware, async (ctx) => {});
