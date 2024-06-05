import { Hono, type Context } from "hono";
import { authMiddleware } from "../utils/authMiddleware";
import { and, eq } from "drizzle-orm";
import {
	category as categoryTable,
	transaction as transactionTable,
	monthHistory as monthHistoryTable,
	yearHistory as yearHistoryTable,
} from "../db/schemas/schema";
import { db } from "../db/db";
import { type TransactionType, CreateTransactionSchema } from "../utils/types";

export const transactions = new Hono()
	.post("/", authMiddleware, async (ctx) => {
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";

		//! complete implementing transaction
		const { amount, category, date, description, type } = ctx.req.query();

		const requestObject: TransactionType = {
			amount: Number(amount),
			category: category,
			date: new Date(date),
			description,
			type,
		};

		const validatedRequestQuery =
			CreateTransactionSchema.safeParse(requestObject);
		if (!validatedRequestQuery.success) {
			return ctx.json(
				{ error: "could not parse transaction request body" },
				400,
			);
		}
		// const { amount, category, date, description, type } =
		// validatedRequestQuery.data;
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
			await tx.update(transactionTable).set({
				userId: userID,
				amount: validatedRequestQuery.data.amount,
				date: date,
				description: description || "",
				type: type,
				category: categoryRow.name,
				categoryIcon: categoryRow.icon,
			});
			await tx
				.insert(monthHistoryTable)
				.values({})
				.onConflictDoUpdate({
					setWhere: and(
						eq(monthHistoryTable.userId, userID),
						eq(monthHistoryTable.day, date.getUTCDate()),
					),
				});
		});
	})
	.get("/", authMiddleware, async (ctx) => {});
