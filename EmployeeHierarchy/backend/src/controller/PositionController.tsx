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
import { z } from "zod";



export const createController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validated = positionSchema.parse(body); // Validate the request body
    const position = await createPosition(validated); // Create the position
    return c.json(position, 201); 
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        400 
      );
    } else if (error instanceof Error) {
      // Handle other errors
      throw new HTTPException(500, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const updateController = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const position = await updatePosition(id, body);
    return c.json(position);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(500, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const getByIdController = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const position = await getByIdPosition(id);
    return c.json(position);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(404, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const getAllController = async (c: Context) => {
  try {
    const tree = await getPositionsTree();
    return c.json(tree);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(500, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const getChildrenController = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const children = await getChildrenPosition(id);
    return c.json(children);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(404, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const deleteController = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const deleted = await deletePosition(id);
    return c.json({ message: "Deleted" });
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(500, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const getChoicesController = async (c: Context) => {
  try {
    const choices = await getChoices();
    return c.json(choices);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(404, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};

export const getPositionsTreeController = async (c: Context) => {
  try {
    const tree = await getPositionsTree();
    return c.json(tree);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(500, { message: error.message });
    }
    throw new HTTPException(500, { message: "Unknown error" });
  }
};