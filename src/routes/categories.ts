import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/db.ts";
import { z } from "zod";
import { authMiddleware } from "../utils/authMiddleware.ts";

export const categories = new Hono().get("/", authMiddleware, async (ctx) => {
	const userSearchQuery = ctx.req.query("type");
	const verifiedSessionToken = ctx.var.verifiedSessionToken;
	const userId = ctx.var.userId;

	const validator = z.enum(["expense", "income"]);
	const validateUserQuery = validator.safeParse(userSearchQuery);

	if (!validateUserQuery) {
		return ctx.json(validateUserQuery.error);
	}
	if (!userId && !verifiedSessionToken.verified) {
		return ctx.json({ message: "not logged in" });
	}
});
