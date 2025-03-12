import { TreeNodeData } from "@mantine/core";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; 

export interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
}


export const fetchPositions = async (): Promise<Position[]> => {
  try{const response = await axios.get<Position[]>(`${API_BASE_URL}/positions`);
  return response.data;}
  catch(error){
    throw 
  }
};


export const fetchPositionChoices = async (): Promise<Position[]> => {
  const response = await axios.get<Position[]>(`${API_BASE_URL}/positions/choices`);
  return response.data;
};


export const createPosition = async (data: Omit<Position, "id">): Promise<Position> => {
  try {
    console.log("Sending payload:", data); 
    const response = await axios.post<Position>(`${API_BASE_URL}/positions`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating position:", error);
    throw error;
  }
};

export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  const response = await axios.put<Position>(`${API_BASE_URL}/positions/${id}`, data);
  return response.data;
};

export const deletePosition = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/positions/${id}`);
};



interface TreeNode {
  id: string;
  name: string;
  description: string;
  children: TreeNode[];
}

export const fetchPositionsTree = async (): Promise<TreeNode[]> => {
  const response = await axios.get<TreeNode[]>(`${API_BASE_URL}/positions/tree`);
  console.log("API Response (Tree):", response.data); // Log the API response
  return response.data;
};

export const transformTreeToMantineTree = (nodes: TreeNode[]): TreeNodeData[] => {
  return nodes.map((node) => ({
    value: node.id,
    label: node.name,
    description: node.description, // Optional: Include description if needed
    children: transformTreeToMantineTree(node.children),
  }));
};
