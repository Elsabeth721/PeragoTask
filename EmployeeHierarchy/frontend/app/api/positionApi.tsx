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
  // console.log("Fetching positions...");
  const response = await axios.get<Position[]>(`${API_BASE_URL}/positions`);
  // console.log("Positions data:", response.data);
  return response.data;
};


export const fetchPositionChoices = async (): Promise<Position[]> => {
  console.log("Fetching positions...");
  const response = await axios.get<Position[]>(`${API_BASE_URL}/positions/choices`);
  // console.log("Choices data:", response.data);
  return response.data;
};


export const createPosition = async (data: Omit<Position, "id">): Promise<Position> => {
  try {
    console.log("Sending payload:", data); // Log the payload
    const response = await axios.post<Position>(`${API_BASE_URL}/positions`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating position:", error);
    throw error;
  }
};

// Update a position
export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  const response = await axios.put<Position>(`${API_BASE_URL}/positions/${id}`, data);
  return response.data;
};

// Delete a position
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
