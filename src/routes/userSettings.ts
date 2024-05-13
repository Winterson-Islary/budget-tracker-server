import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";

const UserSettingHardCoded = {
	data: {
		userId: "testUserFromServer",
		currency: "USD",
	},
};
let Currency: string | undefined = "USD";

export const userSettings = new Hono()
	.get("/", async (ctx) => {
		const auth = getAuth(ctx);
		if (!auth?.userId) {
			return ctx.json({
				message: "You are not logged in.",
			});
		}
		return ctx.json({
			message: "You are logged in.",
			currency: Currency,
			userId: auth.userId,
		});
	})
	.post("/", async (ctx) => {
		const body = await ctx.req.json();
		console.log(body);
		Currency = body.currency;
		return ctx.json({ message: "Successfully Completed Update" });
	});
// .delete
// .put
