import { Context, Hono } from "hono";
import { fromHono} from "chanfana";


export type AppContext = Context<{}>;

// Create Hono app
const app = new Hono<{}>();

// Initialize Chanfana for Hono
const openapi = fromHono(app, {
	schema: {
		info: {
			title: "Pioneer Rocketry Website",
			version: "1.0.0",
			description: "Website for Pioneer Rocketry Club at UWP",
			contact: {
				name: "Kristopher Adams",
				url: "https://retreat896.com",
				email: "kris.adams3000@gmail.com",
			},
		},
	},
	docs_url: "/docs",
	openapiVersion: "3.1",
	generateOperationIds: true,
	raiseUnknownParameters: false,
});

app.use("*", async (c, next) => {
	await next();
	c.res.headers.set("Access-Control-Allow-Origin", "*");
	c.res.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	c.res.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
});

app.options("*", (c) => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "https://dev.pioneerrocketry.com, https://pioneerrocketry.com",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
});

// Serve static files
app.get("/", (c) => c.redirect("/index.html"));
app.get("/*", async (c) => {
    try {
        const file = await Bun.file(`../${c.req.path}`).text();
        return new Response(file, {
            headers: {
                "Content-Type": c.req.path.endsWith(".html") ? "text/html" : "text/plain",
            },
        });
    } catch {
        return c.json({ success: false, error: "File not found" }, 404);
    }
});

// 404 for everything else
app.all("*", (c) =>
	c.json(
		{
			success: false,
			error: "Route not found",
		},
		404
	)
);

// Export the Hono app
export default app;
