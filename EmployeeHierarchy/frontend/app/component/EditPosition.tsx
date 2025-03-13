"use client";

import { IconChevronDown, IconEdit, IconTrash } from "@tabler/icons-react";
import { Group, Tree, TextInput, Textarea, Button, Modal } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPositionsTree,
  transformTreeToMantineTree,
  updatePosition,
  deletePosition,

} from "../api/positionApi";
import { useState } from "react";
import { Position } from "../interface/positionInterface";

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
    <div className="flex flex-col h-screen bg-gray-50">
      <h2 className="text-3xl font-bold p-4 text-center text-gray-800">
        Perago Information System Employee Hierarchy
      </h2>
  
      <div className="flex flex-1 overflow-auto p-8 bg-gray-50">
        <div className="flex gap-8 w-full">
          <div className="flex-1 overflow-auto">
            <Tree
              data={hierarchy}
              levelOffset={30}
              className="custom-tree p-4 bg-white rounded-lg shadow-sm"
              renderNode={({ node, expanded, hasChildren, elementProps, level }) => (
                <Group
                  gap={5}
                  {...elementProps}
                  className="flex flex-row items-center gap-2"
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
                        cursor: "pointer",
                      }}
                    />
                  )}
                  <span
                    onClick={() => handleNodeClick(node as ExtendedTreeNodeData)}
                    className="text-gray-800 font-medium cursor-pointer"
                  >
                    {node.label}
                  </span>
                </Group>
              )}
            />
          </div>
  
          {selectedNode && (
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-md mx-auto overflow-auto">
              <h3 className="text-xl font-semibold mb-5 text-gray-700 text-center">
                Edit Position
              </h3>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Name</label>
                  <TextInput
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                  />
                </div>
  
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Description</label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                    minRows={3}
                  />
                </div>
              </div>
  
              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <Button
                  onClick={handleEdit}
                  loading={updateMutation.isPending}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 shadow-sm transition"
                >
                  Update
                </Button>
  
                <Button
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 shadow-sm transition"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Sticky Footer */}
      <footer className="bg-gray-900 text-white text-center p-4 sticky bottom-0 w-full">
        &copy; 2025 Perago Information System
      </footer>
    </div>
  );
}
export default EditPositions 