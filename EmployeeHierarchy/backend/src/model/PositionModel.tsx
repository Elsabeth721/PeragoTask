import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { db } from "../config/drizzle.js";
import { eq , isNull} from "drizzle-orm";
import { positions } from "../databaseSchema/schema.js";

export const checkRootPositionExists = async (): Promise<boolean> => {
  const [rootPosition] = await db
    .select()
    .from(positions)
    .where(isNull(positions.parentId))
    .limit(1);
  return !!rootPosition;
};

export const checkParentPositionExists = async (parentId: string): Promise<boolean> => {
  const [parentPosition] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, parentId))
    .limit(1);

  return !!parentPosition
};
export const getPositionLevel = async (id: string): Promise<number> => {
  let level = 0;
  let parent = await getById(id);

  while (parent[0]?.parentId) {
    level++;
    parent = await getById(parent[0].parentId);
  }

  return level;
};
export const create  = async (data: { name: string; description: string; parentId?: string | null }) => {
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
        parentId: positions.parentId 
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

export const getPositionById = async (id: string) => {
    return await db
        .select()
        .from(positions)
        .where(eq(positions.id, id));
};

export const getChildrenPositions = async (parentId: string) => {
    return await db
        .select()
        .from(positions)
        .where(eq(positions.parentId, parentId));
};

