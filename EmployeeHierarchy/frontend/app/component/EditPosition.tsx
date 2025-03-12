"use client";

import { IconChevronDown, IconEdit, IconTrash } from "@tabler/icons-react";
import { Group, Tree, TextInput, Textarea, Button, Modal } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPositionsTree,
  transformTreeToMantineTree,
  updatePosition,
  deletePosition,
  Position,
} from "../api/positionApi";
import { useState } from "react";

interface ExtendedTreeNodeData {
  value: string;
  label: string;
  description?: string;
  children?: ExtendedTreeNodeData[];
}

const EditPositions = () => {
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<ExtendedTreeNodeData | null>(
    null
  );
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const {
    data: treeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["positions-tree"],
    queryFn: fetchPositionsTree,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Position> }) =>
      updatePosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions-tree"] }); 
      setSelectedNode(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions-tree"] }); 
      setSelectedNode(null);
    },
  });

  const handleNodeClick = (node: ExtendedTreeNodeData) => {
    setSelectedNode(node);
    setEditForm({ name: node.label, description: node.description || "" });
  };

  const handleEdit = () => {
    if (selectedNode) {
      updateMutation.mutate({
        id: selectedNode.value,
        data: { name: editForm.name, description: editForm.description },
      });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      deleteMutation.mutate(selectedNode.value);
    }
  };

  if (isLoading) return <p>Loading positions...</p>;
  if (isError) return <p>Error fetching positions.</p>;

  const hierarchy = transformTreeToMantineTree(treeData || []);
  console.log("Hierarchy:", JSON.stringify(hierarchy, null, 2));

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Perago Information System Employee Hierarchy
      </h2>

      <div className="flex gap-8">
        <div className="flex-1">
          <Tree
            data={hierarchy}
            levelOffset={30}
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "16px",
            }}
            className="custom-tree"
            renderNode={({
              node,
              expanded,
              hasChildren,
              elementProps,
              level,
            }) => (
              <Group
                gap={5}
                {...elementProps}
                style={{
                  paddingLeft: `${level * 20}px`,
                  transition: "padding-left 0.2s ease",
                }}
                className="flex flex-row items-center gap-2"
              >
                {hasChildren && (
                  <IconChevronDown
                    size={18}
                    // onClick={(e) => e.stopPropagation()}
                    style={{
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      color: expanded ? "#4f46e5" : "#6b7280",
                      cursor: "pointer",
                    }}
                  />
                )}

                <span
                  onClick={() => handleNodeClick(node as ExtendedTreeNodeData)}
                  style={{
                    color: "#1e293b",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {node.label}
                </span>
              </Group>
            )}
          />
        </div>

        {selectedNode && (
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Edit Position</h3>
            <TextInput
              label="Name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="mb-4"
            />
            <Textarea
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="mb-4"
            />
            <div className="flex gap-4">
              <Button
                leftSection={<IconEdit size={16} />} 
                onClick={handleEdit}
                loading={updateMutation.isPending} 
              >
                Update
              </Button>
              <Button
                leftSection={<IconTrash size={16} />} 
                onClick={handleDelete}
                color="red"
                loading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPositions;
