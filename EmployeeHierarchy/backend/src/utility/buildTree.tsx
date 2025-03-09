export function buildTree(positions) {
    const map = new Map();
    const tree = [];
  
    positions.forEach((pos) => map.set(pos.id, { ...pos, children: [] }));
  
    positions.forEach((pos) => {
      if (pos.parentId) {
        map.get(pos.parentId)?.children.push(map.get(pos.id));
      } else {
        tree.push(map.get(pos.id));
      }
    });
  
    return tree;
  }
  