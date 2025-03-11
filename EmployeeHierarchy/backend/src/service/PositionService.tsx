import { create, deleteModel, getAll, getById, getChildren, update , getAllChoices, getAllPositions} from "../model/PositionModel.js";
import buildTree from "../utility/buildTree.js";
import { db } from "../config/drizzle.js";
import { positions } from "../databaseSchema/schema.js";
import { isNull, eq } from "drizzle-orm";

// Helper function to check if a root position already exists
const checkRootPositionExists = async (): Promise<boolean> => {
  const [rootPosition] = await db
    .select()
    .from(positions)
    .where(isNull(positions.parentId))
    .limit(1);
  return !!rootPosition; // Returns true if a root position exists
};

const checkParentPositionExists = async (parentId: string): Promise<boolean> => {
  const [parentPosition] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, parentId)) // <-- This expects an ID, not a name
    .limit(1);
  return !!parentPosition;
};
export const createPosition = async (validated: {
  name: string;
  description?: string | undefined;
  parentId?: string | undefined;
}) => {
  // Check if the new position is intended to be a root position
  // console.log("My parent", validated)
  if (validated.parentId === null || validated.parentId === undefined) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      throw new Error("A root position already exists. Only one root position is allowed.");
    }
  } else {
    // Check if the parent position exists
    const parentExists = await checkParentPositionExists(validated.parentId);
    if (!parentExists) {
      throw new Error("The specified parent position does not exist.");
    }
  }

  // Create the position
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
  // Check if the update is trying to set parentId to null
  if (data.parentId === null) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      // Check if the existing root position is the same as the one being updated
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

  // Update the position
  return update(id, {
    ...data,
    parentId: data.parentId === null ? undefined : data.parentId,
  });
};

export const getByIdPosition = async (id: string) => {
  return getById(id);
};

// export const getAllPosition = async () => {
//   const positions = await getAll();
//   console.log("Fetched Positions from DB:", positions); // Debugging output
//   return buildTree(positions);
// };
export const getPositionsTree = async () => {
  try {
    const positio = await db.select().from(positions); // Fetch data from DB
    const tree = buildTree(positio); // Build the tree
    console.log("Tree:", JSON.stringify(tree, null, 2)); // Log the tree with proper formatting
    return tree;
  } catch (error) {
    console.error("❌ Error fetching positions:", error);
    throw error;
  }
};

export const getChildrenPosition = async (id: string) => {
  return getChildren(id);
};

export const deletePosition = async (id: string) => {
  // Check if the position being deleted is the root position
  const [position] = await getById(id);
  if (position && position.parentId === null) {
    throw new Error("Cannot delete the root position. Only editing is allowed.");
  }

  // Delete the position
  return deleteModel(id);
};

export const getChoices= async () => {
  const positions = await getAllChoices();
  return positions
};

