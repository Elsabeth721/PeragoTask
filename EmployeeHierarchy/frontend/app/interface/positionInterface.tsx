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