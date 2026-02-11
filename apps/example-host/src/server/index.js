import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createFileRouter } from "./router/fileRouter.js";
import { renderRequest } from "./render/renderRequest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const isProd = process.env.NODE_ENV === "production";

if (isProd)
{
	// Serve Vite build output so /assets/... works
	app.use(express.static(path.resolve(__dirname, "../../dist/client"), {
		immutable: true,
		maxAge: "1y",
	}));
}

const router = await createFileRouter({
	routesDir: new URL("../app/routes/", import.meta.url),
});

app.get("*", async (req, res) => {
	try
	{
		await renderRequest({ req, res, router });
	}
	catch (err)
	{
		// eslint-disable-next-line no-console
		console.error(err);
		res.status(500).send("Server Error");
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`SSR server listening on http://localhost:${port}`);
});
