import { and, asc, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/db.ts";
import { category } from "../db/schemas/schema.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";
import {
	CreateCategorySchema,
	type CreateCategorySchemaType,
} from "../utils/types.ts";

export const categories = new Hono()
	.get("/", authMiddleware, async (ctx) => {
		const userSearchQuery = ctx.req.query("type");
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;

		const validator = z.enum(["expense", "income"]);
		const validateUserQuery = validator.safeParse(userSearchQuery);

		if (!validateUserQuery.success) {
			return ctx.json({ error: validateUserQuery.error }, 400);
		}
		const type = validateUserQuery.data;
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
		const dbQueryResult = await db.query.category.findMany({
			where: and(
				eq(category.userId, userID),
				type ? ilike(category.type, type) : undefined,
			),
			orderBy: [asc(category.name)],
		});
		return ctx.json({ dbQueryResult }, 200);
	})
	.post("/", authMiddleware, async (ctx) => {
		const userPostBody = await ctx.req.json();
		const { name, icon, type } = userPostBody;
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;
		console.log(userPostBody);
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
		if (userId === "user-does-not-exist") {
			return ctx.json({ message: "invalid user" }, 500);
		}
		try {
			await db.insert(category).values({
				name: name,
				icon: icon,
				type: type,
				userId: userID,
			});
			return ctx.json({ message: "successfully created category" }, 201);
		} catch (err) {
			console.log(err);
			return ctx.json({ message: err }, 400);
		}
	});
