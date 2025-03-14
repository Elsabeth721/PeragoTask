import { TreeNodeData } from "@mantine/core";

export interface Position {
    id: string;
    name: string;
    description: string;
    parentId: string | null;
  }

export interface TreeNode {
    id: string;
    name: string;
    description: string;
    children: TreeNode[];
  }  
export interface ExtendedTreeNodeData {
    parentId: string;
    value: string;
    label: string;
    description?: string;
    children?: ExtendedTreeNodeData[];
  }

  export const transformTreeToMantineTree = (nodes: TreeNode[]): TreeNodeData[] => {
    return nodes.map((node) => ({
      value: node.id,
      label: node.name,
      description: node.description, 
      children: transformTreeToMantineTree(node.children),
    }));
  };