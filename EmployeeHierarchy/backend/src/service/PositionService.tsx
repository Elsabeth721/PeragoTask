import { create, deleteModel, getAll, getById, getChildren, update, getAllChoices, getAllPositions, 
  // checkRootPositionExists, checkParentPositionExists, getPositionLevel
 } from "../model/PositionModel.js";
import buildTree, { type Position } from "../utility/buildTree.js";
import { db } from "../config/drizzle.js";
import { positions } from "../databaseSchema/schema.js";
import { isNull, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export const createPosition = async (validated: {
  name: string;
  description?: string | undefined;
  parentId?: string;
}) => {
  try{
  if (validated.parentId === "" || validated.parentId === undefined) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      throw new Error("A root position already exists. Only one root position is allowed.");
    }
  } else {
    const parentExists = await checkParentPositionExists(validated.parentId);
    console.log("Root..........Check the boolean", parentExists)
    if (!parentExists) {
      throw new Error("The specified parent position does not exist.");
    }
  }

  return create({
    ...validated,
    description: validated.description || "",
    parentId: validated.parentId == "" ? null : validated.parentId
  });
}catch(error:Error | any){
  // console.log("The error is ..........," , error,  validated.parentId, "ppp")
     throw new HTTPException(500, { message: error.message })
}
};

// export const updatePosition = async (id: string, data: {
//   name?: string;
//   description?: string;
//   parentId?: string | null;
// }) :Promise<Position> => {
//   if (data.parentId === null) {
//     const rootExists = await checkRootPositionExists();
//     if (rootExists) {
//       const [existingRoot] = await getById(id);
//       if (existingRoot && existingRoot.id !== id) {
//         throw new Error("A root position already exists. Only one root position is allowed.");
//       }
//     }
//   }

//   if (data.parentId) {
//     const parentHierarchyLevel = await getPositionLevel(data.parentId);
//     const currentHierarchyLevel = await getPositionLevel(id);
    
//     if (parentHierarchyLevel > currentHierarchyLevel) {
//       throw new Error("Cannot move a position to a lower-level position.");
//     }
//   }

//   return updatePosition(id, {
//     ...data,
//     parentId: data.parentId === null ? undefined : data.parentId,
//   });
// };

export const getByIdPosition = async (id: string) => {
  const position = await getById(id);
  if (!position) {
    throw new Error("Position not found.");
  }
  return position;
};

export const getPositionsTree = async () => {
  try {
    const position = await getAll();
    // db.select().from(positions);
    const tree = buildTree(position);
    return tree;
  } catch (error) {
    console.error("Error fetching positions:", error);
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

  if (!position) {
    throw new Error("Position not found.");
  }

  if (position.parentId === null) {
    throw new Error("Cannot delete the root position. Only editing is allowed.");
  }

  const children = await getChildren(id);
  // db.select().from(positions).where(eq(positions.parentId, id));

  if (children.length > 0) {
    throw new Error("Cannot delete a position that has subordinates, remove them first.");
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

  return !!parentPosition
};


export const updatePosition = async (id: string, data: {
  name?: string;
  description?: string;
  parentId?: string | null;
}) => {
  if (data.parentId === null) {
    const rootExists = await checkRootPositionExists();
    if (rootExists) {
      const [existingRoot] = await getById(id);
      //  await db
      //   .select()
      //   .from(positions)
      //   .where(isNull(positions.parentId))
      //   .limit(1);

      if (existingRoot && existingRoot.id !== id) {
        throw new Error("A root position already exists. Only one root position is allowed.");
      }
    }
  }

  // lower hierarchy check 
  if (data.parentId) {
    const parentHierarchyLevel = await getPositionLevel(data.parentId);
    const currentHierarchyLevel = await getPositionLevel(id);
    
    if (parentHierarchyLevel > currentHierarchyLevel) {
      throw new Error("Cannot move a position to a lower-level position.");
    }
  }

  return update(id, {
    ...data,
    parentId: data.parentId === null ? undefined : data.parentId,
  });
};

// Get the level 
export const getPositionLevel = async (id: string): Promise<number> => {
  let level = 0;
  let parent = await getById(id);
  // db
  //   .select()
  //   .from(positions)
  //   .where(eq(positions.id, id))
  //   .limit(1);

  while (parent[0]?.parentId) {
    level++;
    parent = await getById(parent[0].parentId);
    // db
    //   .select()
    //   .from(positions)
    //   .where(eq(positions.id, parent[0].parentId))
    //   .limit(1);
  }

  return level;
};


