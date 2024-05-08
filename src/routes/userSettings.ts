import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";

const UserSettingHardCoded = {
	data: {
		userId: "testUserFromServer",
		currency: "USD",
	},
};
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
			userId: auth.userId,
		});
	})
	.post("/", (ctx) => {
		return ctx.json({});
	});
// .delete
// .put
