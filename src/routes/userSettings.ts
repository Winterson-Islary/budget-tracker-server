import { getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { db } from "../db/db.ts";
import { userSettings as userSettingsTable } from "../db/schemas/schema.ts";
import { verifyJWT } from "../utils/verifySession.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";

export const userSettings = new Hono()
	.get("/", authMiddleware, async (ctx) => {
		const userId = ctx.var.userId;
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		if (userId || verifiedSessionToken.verified) {
			const userID =
				userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
			const settings = await db
				.select()
				.from(userSettingsTable)
				.where(eq(userSettingsTable.userId, userID));
			// console.log(settings[0]);

			return ctx.json({
				message: "You are logged in.",
				settings: settings[0],
				userId: userID,
			});
		}
	})
	.post("/", authMiddleware, async (ctx) => {
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;

		if (!userId && !verifiedSessionToken.verified) {
			return ctx.json(
				{
					error: "not logged in.",
				},
				401,
			);
		}
		if (userId || verifiedSessionToken.verified) {
			const userID =
				userId || verifiedSessionToken.object?.userId || "user-does-not-exist";

			const body = await ctx.req.json();
			const entry_exist = await db.query.userSettings.findFirst({
				where: eq(userSettingsTable.userId, userID),
			});

			if (entry_exist) {
				await db
					.update(userSettingsTable)
					.set({ currency: body.currency })
					.where(eq(userSettingsTable.userId, userID));
				return ctx.json({ message: "Updated Currency" });
			}
			await db
				.insert(userSettingsTable)
				.values({ userId: userID, currency: body.currency });
			return ctx.json({ message: "Successfully Completed Setting Currency" });
		}
	});
