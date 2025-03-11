import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { db } from "../config/drizzle.js";
import { eq } from "drizzle-orm";
import { positions } from "../databaseSchema/schema.js";


   export const create  = async (data: { name: string; description: string; parentId?: string }) => {
    console.log("InDb", data)
    return await db.insert(positions).values(data).returning();
  }

  export const update= async (id: string, data: { name?: string; description?: string; parentId?: string }) => {
    return await db.update(positions).set(data).where(eq(positions.id, id)).returning();
  }

  export const getById= async (id: string) => {
    return await db.select().from(positions).where(eq(positions.id, id)).limit(1);
  }

  export const getAll = async () => { 
    return await db.select({
        id: positions.id, 
        name: positions.name, 
        description: positions.description, 
        parentId: positions.parentId // Ensure parentId is selected
    }).from(positions);
};


  export const getAllChoices= async () => {
    return await db.select({id: positions.id, name:positions.name}).from(positions);
  }

  export const getChildren= async (parentId: string) => {
    return await db.select().from(positions).where(eq(positions.parentId, parentId));
  }

  export const deleteModel = async (id: string) => {
    return await db.delete(positions).where(eq(positions.id, id)).returning();
  }



  export const getAllPositions = async () => {
    return await db
        .select({
            id: positions.id,
            name: positions.name,
            description: positions.description,
            parentId: positions.parentId,
        })
        .from(positions);
};

// Get a single position by ID
export const getPositionById = async (id: string) => {
    return await db
        .select()
        .from(positions)
        .where(eq(positions.id, id));
};

// Get all child positions of a given parent
export const getChildrenPositions = async (parentId: string) => {
    return await db
        .select()
        .from(positions)
        .where(eq(positions.parentId, parentId));
};

