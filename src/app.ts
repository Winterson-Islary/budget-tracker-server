import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { categories } from "./routes/categories";
import { userSettings } from "./routes/userSettings";

const App = new Hono();

App.use("*", logger());
App.use(
	"*",
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);
App.use("*", clerkMiddleware());
App.get("/ping", (ctx) => ctx.text("Pong!"));
App.route("/api/settings", userSettings);
App.route("/api/categories", categories);

export default App;
