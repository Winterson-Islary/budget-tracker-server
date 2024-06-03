import { Hono } from "hono";
import { authMiddleware } from "../utils/authMiddleware";
import { and, eq } from "drizzle-orm";
import { category as categoryTable } from "../db/schemas/schema";
import { db } from "../db/db";

export const transactions = new Hono()
	.get("/", authMiddleware, async (ctx) => {
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
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
	})
	.post("/", authMiddleware, async (ctx) => {});
