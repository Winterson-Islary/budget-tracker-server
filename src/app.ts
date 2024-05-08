import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userSettings } from "./routes/userSettings";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const App = new Hono();

App.use("*", logger());
App.use("*", cors());
App.use("*", clerkMiddleware());
App.get("/ping", (ctx) => ctx.text("Pong!"));
App.route("/api/settings", userSettings);

export default App;
