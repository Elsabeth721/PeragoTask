import axios from "axios";
import { Position, TreeNode } from "../interface/positionInterface";

const API_URL = "http://localhost:3001";

export const fetchPositions = async (): Promise<Position[]> => {
  try {
    const response = await axios.get<Position[]>(`${API_URL}/positions`);
    return response.data;
  } 
  catch (error:Error | any) {
    throw new Error(error.response.data);
  }
  // catch (error) {
  //   if (error && typeof error === "object" && "isAxiosError" in error) {
  //     const axiosError = error as { response?: { data?: { message?: string } } };
  //     const errorMessage = axiosError.response?.data?.message || "Failed to fetch positions.";
  //     throw new Error(errorMessage);
  //   }
  //   throw new Error("An unexpected error occurred.");
  // }
};

export const fetchPositionChoices = async (): Promise<Position[]> => {
  try {
    const response = await axios.get<Position[]>(`${API_URL}/positions/choices`);
    return response.data;
  } catch (error:Error | any) {
    throw new Error(error.response.data);
  }
  // try {
  //   const response = await axios.get<Position[]>(`${API_URL}/positions/choices`);
  //   return response.data;
  // } catch (error) {
  //   if (error && typeof error === "object" && "isAxiosError" in error) {
  //     const axiosError = error as { response?: { data?: { message?: string } } };
  //     const errorMessage = axiosError.response?.data?.message || "Failed to fetch position choices.";
  //     throw new Error(errorMessage);
  //   }
  //   throw new Error("An unexpected error occurred.");
  // }
};



export const createPosition = async (data: {name:string, description:string, parentId:string | null}): Promise<Position> => {
  try {
    const response = await axios.post<Position>(`${API_URL}/positions`, data);
    return response.data;
  } catch (error:Error | any) {
    throw new Error(error.response.data);
  }
}
export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  try {
    const response = await axios.put<Position>(`${API_URL}/positions/${id}`, data);
    return response.data;
  } catch (error:Error | any) {
    throw new Error(error.response.data);
  }    
};

export const deletePosition = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/positions/${id}`);
    console.log('Position deleted successfully:', response); 
  } 
  catch (error:Error | any) {
    throw new Error(error.response.data);
  }
  // catch (error) {
  //   if (error && typeof error === "object" && "isAxiosError" in error) {
  //     const axiosError = error as { response?: { data?: { message?: string } } };
  //     const errorMessage = axiosError.response?.data?.message || "Failed to delete position.";
  //     // console.error("Error deleting position:", errorMessage); 
  //     throw new Error(errorMessage);
  //   }
  //   console.error("Unexpected error occurred:", error); 
  //   throw new Error("An unexpected error occurred.");
  // }
};

export const fetchPositionsTree = async (): Promise<TreeNode[]> => {
  try {
    const response = await axios.get<TreeNode[]>(`${API_URL}/positions/tree`);
    return response.data;
  } 
  catch (error:Error | any) {
    throw new Error(error.response.data);
  }
  // catch (error) {
  //   if (error && typeof error === "object" && "isAxiosError" in error) {
  //     const axiosError = error as { response?: { data?: { message?: string } } };
  //     const errorMessage = axiosError.response?.data?.message || "Failed to fetch positions tree.";
  //     throw new Error(errorMessage);
  //   }
  //   throw new Error("An unexpected error occurred.");
  // }
};
export const fetchPositionsPagination = async (page: number, limit: number): Promise<{ data: Position[], meta: { total: number, page: number, limit: number, totalPages: number } }> => {
  try {
    const res = await axios.get<{ data: Position[], meta: { total: number, page: number, limit: number, totalPages: number } }>(`${API_URL}/positions/pagination?page=${page}&limit=${limit}`);
    console.log("API Response:", res.data); // Check if data is correct
    return res.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};