import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import positionRoutes from "./routes/PositionRoutes.js";
import { cors } from "hono/cors";

const app = new Hono();

// Apply CORS middleware FIRST
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"], // Allow requests from this origin
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowHeaders: ["Content-Type"], // Allowed headers
    credentials: true, // Allow credentials (e.g., cookies)
  })
);

// Define your routes AFTER applying CORS
app.route("/positions", positionRoutes);

// Test route
app.get("/test", (c) => {
  return c.json({ message: "CORS is working!" });
});

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Something went wrong" }, 500);
});

// Start the server
serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);