import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { positionSchema } from "../validator/zodvalidator.js";
import {
  createPosition,
  deletePosition,
  getAllPosition,
  getByIdPosition,
  getChildrenPosition,
  updatePosition,
} from "../service/PositionService.js";

export const createController = async (c: Context) => {
  const body = await c.req.json();
  const validated = positionSchema.parse(body);
  const position = await createPosition(validated);
  return c.json(position, 201);
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
  const tree = await getAllPosition();
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
