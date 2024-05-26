import { and, asc, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/db.ts";
import { category } from "../db/schemas/schema.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";

export const categories = new Hono().get("/", authMiddleware, async (ctx) => {
	const userSearchQuery = ctx.req.query("type");
	const verifiedSessionToken = ctx.var.verifiedSessionToken;
	const userId = ctx.var.userId;

	const validator = z.enum(["expense", "income"]);
	const validateUserQuery = validator.safeParse(userSearchQuery);

	if (!validateUserQuery.success) {
		return ctx.json({ error: validateUserQuery.error }, 400);
	}
	const type = validateUserQuery.data;
	console.log(type);
	const userID =
		userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
	const dbQueryResult = await db.query.category.findMany({
		where: and(
			eq(category.userId, userID),
			type ? ilike(category.type, type) : undefined,
		),
		orderBy: [asc(category.name)],
	});
	console.log(dbQueryResult);
	return ctx.json({ category: dbQueryResult[0] }, 200);
});
