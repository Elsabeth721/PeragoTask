import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import positionRoutes from "./routes/PositionRoutes.js";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"], 
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowHeaders: ["Content-Type"], 
    credentials: true, 
  })
);

app.route("/positions", positionRoutes);

app.onError((err, c) => {
  console.log("The error", err)
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Something went wrong" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);