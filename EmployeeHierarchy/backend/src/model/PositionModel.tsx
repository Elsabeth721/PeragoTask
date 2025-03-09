import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { db } from "../config/drizzle.js";
import { eq } from "drizzle-orm";
import { positions } from "../databaseSchema/schema.js";


   export const create  = async (data: { name: string; description: string; parentId?: string }) => {
    return db.insert(positions).values(data).returning();
  }

  export const update= async (id: string, data: { name?: string; description?: string; parentId?: string }) => {
    return db.update(positions).set(data).where(eq(positions.id, id)).returning();
  }

  export const getById= async (id: string) => {
    return db.select().from(positions).where(eq(positions.id, id)).limit(1);
  }

  export const getAll= async () => {
    return db.select().from(positions);
  }

  export const getChildren= async (parentId: string) => {
    return db.select().from(positions).where(eq(positions.parentId, parentId));
  }

  export const deleteModel = async (id: string) => {
    return db.delete(positions).where(eq(positions.id, id)).returning();
  }

