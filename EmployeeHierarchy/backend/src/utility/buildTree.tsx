export type Position = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
};

export type TreeNode = {
  id: string;
  name: string;
  description: string;
  children: TreeNode[];
};

const buildTree = (
  positions: Position[],
  parentId: string | null = null
): TreeNode[] => {
  const filteredPositions = positions.filter((pos) => pos.parentId === parentId);
  // console.log("Filtered Positions:", filteredPositions);

  return filteredPositions.map((pos) => {
    const children = buildTree(positions, pos.id);
    // console.log(`Children for ${pos.name}:`, children);
    return {
      id: pos.id,
      name: pos.name,
      description: pos.description,
      children: children,
    };
  });
};
export default buildTree