import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { db } from "../db/db.ts";
import { userSettings as userSettingsTable } from "../db/schemas/schema.ts";
import { eq } from "drizzle-orm";
import { getCookie, getSignedCookie } from "hono/cookie";
import { userConfig } from "../utils/config.ts";
import { verifyJWT } from "../utils/verifySession.ts";

export const userSettings = new Hono()
	.get("/", async (ctx) => {
		const sessionToken = getCookie(ctx, "__session");
		console.log(sessionToken);
		const verifiedSessionToken = verifyJWT(sessionToken);
		// console.log(verifiedSessionToken);
		const auth = await getAuth(ctx);

		if (!auth?.userId && !verifiedSessionToken) {
			return ctx.json({ message: "Not logged in." });
		}
		if (auth?.userId || verifiedSessionToken) {
			const userID = auth?.userId || "no-user";
			const settings = await db
				.select()
				.from(userSettingsTable)
				.where(eq(userSettingsTable.userId, userID));
			console.log(settings[0]);

			return ctx.json({
				message: "You are logged in.",
				settings: settings[0],
				userId: auth?.userId,
			});
		}
	})
	.post("/", async (ctx) => {
		const sessionToken = getCookie(ctx, "__session");
		const verifiedSessionToken = verifyJWT(sessionToken);
		const auth = getAuth(ctx);

		if (!auth?.userId && !verifiedSessionToken) {
			return ctx.json({
				message: "You are not logged in.",
			});
		}
		const userID = auth?.userId || "no-user";
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
	});
