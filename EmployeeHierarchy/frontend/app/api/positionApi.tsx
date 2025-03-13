import axios from "axios";
import { Position, TreeNode } from "../interface/positionInterface";
import { TreeNodeData } from "@mantine/core";

const API_URL = "http://localhost:3001";

export const fetchPositions = async (): Promise<Position[]> => {
  try {
    const response = await axios.get<Position[]>(`${API_URL}/positions`);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      // Handle Axios error
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Failed to fetch positions.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const fetchPositionChoices = async (): Promise<Position[]> => {
  try {
    const response = await axios.get<Position[]>(`${API_URL}/positions/choices`);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Failed to fetch position choices.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};



export const createPosition = async (data: Omit<Position, "id">): Promise<Position> => {
  try {
    const response = await axios.post<Position>(`${API_URL}/positions`, data);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      const axiosError = error as { response?: { status: number; data: any } };
      if (axiosError.response?.status === 400 && axiosError.response.data?.errors) {
        const validationErrors = axiosError.response.data.errors
          .map((err: { field: string; message: string }) => `${err.field}: ${err.message}`)
          .join("\n");
        throw new Error(validationErrors);
      } else {
        throw new Error(axiosError.response?.data?.message || "Failed to create position.");
      }
    }
    throw new Error("An unexpected error occurred.");
  }
}
export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  try {
    const response = await axios.put<Position>(`${API_URL}/positions/${id}`, data);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Failed to update position.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const deletePosition = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/positions/${id}`);
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Failed to delete position.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const fetchPositionsTree = async (): Promise<TreeNode[]> => {
  try {
    const response = await axios.get<TreeNode[]>(`${API_URL}/positions/tree`);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "isAxiosError" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Failed to fetch positions tree.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const transformTreeToMantineTree = (nodes: TreeNode[]): TreeNodeData[] => {
  return nodes.map((node) => ({
    value: node.id,
    label: node.name,
    description: node.description, // Optional: Include description if needed
    children: transformTreeToMantineTree(node.children),
  }));
};

