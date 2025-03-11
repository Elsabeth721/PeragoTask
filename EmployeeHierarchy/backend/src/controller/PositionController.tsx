import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { positionSchema } from "../validator/zodvalidator.js";
import {
  createPosition,
  deletePosition,
  getPositionsTree,
  getByIdPosition,
  getChildrenPosition,
  updatePosition,
  getChoices
} from "../service/PositionService.js";


export const createController = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log("Received payload:", body);
    const validated = positionSchema.parse(body);
    console.log("------", validated)

    // Call the service method to insert into the database
    const position = await createPosition(validated);
    return c.json(position, 201);
  } catch (error) {
    console.error("Error in createController:", error);
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Internal Server Error", cause: error });
  }
};

export const updateController = async (c: Context) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const position = await updatePosition(id, body);
  if (!position) throw new HTTPException(404, { message: "Position not found" });
  return c.json(position);
};

export const getByIdController = async (c: Context) => {
  const id = c.req.param("id");
  const position = await getByIdPosition(id);
  if (!position) throw new HTTPException(404, { message: "Not found" });
  return c.json(position);
};

export const getAllController = async (c: Context) => {
  const tree = await getPositionsTree();
  return c.json(tree);
};

export const getChildrenController = async (c: Context) => {
  const id = c.req.param("id");
  const children = await getChildrenPosition(id);
  return c.json(children);
};

export const deleteController = async (c: Context) => {
  const id = c.req.param("id");
  const deleted = await deletePosition(id);
  if (!deleted) throw new HTTPException(404, { message: "Position not found" });
  return c.json({ message: "Deleted" });
};


export const getChoicesController = async (c: Context) => {
  const choices = await getChoices()
  if (!choices) throw new HTTPException(404, { message: "Position not found" });
  return c.json(choices);
};


export const getPositionsTreeController = async (c:Context)=>{
  const tree = await getPositionsTree();
  if (!tree) throw new HTTPException(404, { message: "Position treee not done" });
  return c.json(tree);
}