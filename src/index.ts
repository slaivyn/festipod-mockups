import { serve } from "bun";
import index from "./index.html";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = serve({
  port,
  routes: {
    // Serve Cucumber HTML report
    "/reports/cucumber": async () => {
      const file = Bun.file("reports/cucumber-report.html");
      if (await file.exists()) {
        return new Response(file, {
          headers: { "Content-Type": "text/html" },
        });
      }
      return new Response("No test report found. Run 'bun run test:cucumber' first.", {
        status: 404,
      });
    },

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Serve index.html for all unmatched routes (must be last)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
