import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { db } from "../db/db.ts";
import { userSettings as userSettingsTable } from "../db/schemas/schema.ts";
import { eq } from "drizzle-orm";

export const userSettings = new Hono()
	.get("/", async (ctx) => {
		const auth = getAuth(ctx);
		if (!auth?.userId) {
			return ctx.json({
				message: "You are not logged in.",
			});
		}
		const settings = await db
			.select()
			.from(userSettingsTable)
			.where(eq(userSettingsTable.userId, auth.userId));

		return ctx.json({
			message: "You are logged in.",
			settings: settings[0],
			userId: auth.userId,
		});
	})
	.post("/", async (ctx) => {
		const auth = getAuth(ctx);
		if (!auth?.userId) {
			return ctx.json({
				message: "You are not logged in.",
			});
		}
		const body = await ctx.req.json();
		const entry_exist = await db.query.userSettings.findFirst({
			where: eq(userSettingsTable.userId, auth.userId),
		});
		if (entry_exist) {
			await db
				.update(userSettingsTable)
				.set({ currency: body.currency })
				.where(eq(userSettingsTable.userId, auth.userId));
			return ctx.json({ message: "Updated Currency" });
		}
		await db
			.insert(userSettingsTable)
			.values({ userId: auth.userId, currency: body.currency });
		return ctx.json({ message: "Successfully Completed Setting Currency" });
	});
