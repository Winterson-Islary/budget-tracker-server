import { getAuth } from "@hono/clerk-auth";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifyJWT } from "../utils/verifySession.ts";

type Env = {
	Variables: {
		// auth: ReturnType<typeof getAuth>;
		userId: string | null | undefined;
		verifiedSessionToken: ReturnType<typeof verifyJWT>;
	};
};

export const authMiddleware = createMiddleware<Env>(async (ctx, next) => {
	const auth = getAuth(ctx);
	const userSession = getCookie(ctx, "__session");
	const verifiedSessionToken = verifyJWT(userSession);
	try {
		if (!auth?.userId && !verifiedSessionToken?.verified) {
			return ctx.json({ error: "unauthorized" }, 401);
		}
		ctx.set("userId", auth?.userId);
		ctx.set("verifiedSessionToken", verifiedSessionToken);
		await next();
	} catch (err) {
		console.log("@AuthMiddleware: ", err);
		return ctx.json({ error: "unauthorized" }, 401);
	}
});
