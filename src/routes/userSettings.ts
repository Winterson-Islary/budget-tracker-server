import { getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { db } from "../db/db.ts";
import { userSettings as userSettingsTable } from "../db/schemas/schema.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";
import { verifyJWT } from "../utils/verifySession.ts";

export const userSettings = new Hono()
	.get("/", authMiddleware, async (ctx) => {
		const userId = ctx.var.userId;
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userID =
			userId || verifiedSessionToken.object?.userId || "user-does-not-exist";
		const entry_exist = await db.query.userSettings.findFirst({
			where: eq(userSettingsTable.userId, userID),
		});
		if (!entry_exist && userID !== "user-does-not-exist") {
			return ctx.json({ settings: { userId: "", currency: "" } }, 200);
		}
		const settings = await db
			.select()
			.from(userSettingsTable)
			.where(eq(userSettingsTable.userId, userID));
		// console.log(settings[0]);

		return ctx.json(
			{
				settings: settings[0],
			},
			200,
		);
	})
	.post("/", authMiddleware, async (ctx) => {
		const verifiedSessionToken = ctx.var.verifiedSessionToken;
		const userId = ctx.var.userId;
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
			return ctx.json({ message: "updated currency" }, 201);
		}
		await db
			.insert(userSettingsTable)
			.values({ userId: userID, currency: body.currency });
		return ctx.json(
			{ message: "successfully completed setting currency" },
			201,
		);
	});
