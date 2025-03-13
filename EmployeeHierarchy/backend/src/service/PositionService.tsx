import { create, deleteModel, getAll, getById, getChildren, update, getAllChoices, getAllPositions } from "../model/PositionModel.js";
import buildTree from "../utility/buildTree.js";
import { db } from "../config/drizzle.js";
import { positions } from "../databaseSchema/schema.js";
import { isNull, eq } from "drizzle-orm";

const checkRootPositionExists = async (): Promise<boolean> => {
  const [rootPosition] = await db
    .select()
    .from(positions)
    .where(isNull(positions.parentId))
    .limit(1);
  return !!rootPosition;
};

const checkParentPositionExists = async (parentId: string): Promise<boolean> => {
  const [parentPosition] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, parentId))
    .limit(1);
  return !!parentPosition;
};

export const createPosition = async (validated: {
  name: string;
  description?: string | undefined;
  parentId?: string | undefined;
}) => {
  if (validated.parentId === null || validated.parentId === undefined) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      throw new Error("A root position already exists. Only one root position is allowed.");
    }
  } else {
    const parentExists = await checkParentPositionExists(validated.parentId);
    if (!parentExists) {
      throw new Error("The specified parent position does not exist.");
    }
  }

  return create({
    ...validated,
    description: validated.description || "",
  });
};

export const updatePosition = async (id: string, data: {
  name?: string;
  description?: string;
  parentId?: string | null;
}) => {
  if (data.parentId === null) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      const [existingRoot] = await db
        .select()
        .from(positions)
        .where(isNull(positions.parentId))
        .limit(1);

      if (existingRoot && existingRoot.id !== id) {
        throw new Error("A root position already exists. Only one root position is allowed.");
      }
    }
  }

  return update(id, {
    ...data,
    parentId: data.parentId === null ? undefined : data.parentId,
  });
};

export const getByIdPosition = async (id: string) => {
  const position = await getById(id);
  if (!position) {
    throw new Error("Position not found.");
  }
  return position;
};

export const getPositionsTree = async () => {
  try {
    const positio = await db.select().from(positions);
    const tree = buildTree(positio);
    return tree;
  } catch (error) {
    console.error("❌ Error fetching positions:", error);
    throw new Error("Failed to fetch positions tree.");
  }
};

export const getChildrenPosition = async (id: string) => {
  const children = await getChildren(id);
  if (!children) {
    throw new Error("No children found for this position.");
  }
  return children;
};

export const deletePosition = async (id: string) => {
  const [position] = await getById(id);
  if (position && position.parentId === null) {
    throw new Error("Cannot delete the root position. Only editing is allowed.");
  }

  return deleteModel(id);
};

export const getChoices = async () => {
  const choices = await getAllChoices();
  if (!choices) {
    throw new Error("No positions found.");
  }
  return choices;
};