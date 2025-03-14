"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { Group, Tree, TreeNodeData } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPositionsTree,
} from "../api/positionApi";
import {  transformTreeToMantineTree,
} from '../interface/positionInterface'

const ViewPositions = () => {
  const {
    data: treeData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["positions-tree"],
    queryFn: fetchPositionsTree,
  });

  if (isLoading) return <p>Loading positions...</p>;
  if (isError) return <p>Error fetching positions.</p>;

  const hierarchy = transformTreeToMantineTree(treeData || []);
  // console.log("Hierarchy:", JSON.stringify(hierarchy, null, 2)); 

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Perago Information System Employee Hierarchy
      </h2>

      <Tree
        data={hierarchy}
        levelOffset={30}
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "16px",
        }}
        className="custom-tree"
        renderNode={({ node, expanded, hasChildren, elementProps, level }) => (
          <Group
            gap={5}
            {...elementProps}
            style={{
              paddingLeft: `${level * 20}px`,
              transition: "padding-left 0.2s ease",
            }}
          >
            {hasChildren && (
              <IconChevronDown
                size={18}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  color: expanded ? "#4f46e5" : "#6b7280",
                }}
              />
            )}
            <span style={{ color: "#1e293b", fontWeight: 500 }}>
              {node.label}
            </span>
          </Group>
        )}
      />
    </div>
  );
};

export default ViewPositions;
