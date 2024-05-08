import App from "./src/app";

Bun.serve({
	fetch: App.fetch,
	port: 3000,
});
console.log("Listening on port: 3000");
