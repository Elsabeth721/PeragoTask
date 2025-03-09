import { create, deleteModel, getAll, getById, getChildren, update } from "../model/PositionModel.js";
import { buildTree } from "../utility/buildTree.js";


 export const createPosition= async (validated: { name: string; description?: string | undefined; parentId?: string | undefined; }) => (data: { name: string; description?: string; parentId?: string }) => {
    return create({
        ...data,
        description: data.description || ""
    });
  }

  export const  updatePosition= async (id: string, data: { name?: string; description?: string; parentId?: string }) => {
    return update(id, data);
  }

  export const  getByIdPosition= async (id: string) => {
    return getById(id);
  }

  export const  getAllPosition= async () => {
    const positions = await getAll();
    return buildTree(positions);
  }

  export const  getChildrenPosition= async (id: string)=> {
    return getChildren(id);
  }

  export const  deletePosition= async (id: string)=> {
    return deleteModel(id);
  }

