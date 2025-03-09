import { Hono } from "hono"
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import positionRoutes from "./routes/PositionRoutes.js";

const app = new Hono();
app.route('/',positionRoutes );

app.onError((err, c)=>{
  if (err instanceof HTTPException){
    return err.getResponse();
  }
  return c.json({message: "Something went wrong"}, 500);
})


serve({
    fetch: app.fetch,
    port: 3001
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })




