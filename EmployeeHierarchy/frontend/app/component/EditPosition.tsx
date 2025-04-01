"use client";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import {
  Group,
  Tree,
  TextInput,
  Textarea,
  Button,
  Modal,
  Select,
} from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification, Notifications } from "@mantine/notifications";
import {
  fetchPositionsTree,
  updatePosition,
  deletePosition,
  fetchPositionChoices,
} from "../api/positionApi";
import {
  ExtendedTreeNodeData,
  transformTreeToMantineTree,
} from "../interface/positionInterface";
import { useState } from "react";
import { Position } from "../interface/positionInterface";
import CreatePosition from "./CreatePosition";

const EditPositions = () => {
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<ExtendedTreeNodeData | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // for delete......Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // for create......Modal

  const { data: positions } = useQuery({
    queryKey: ["choices"],
    queryFn: fetchPositionChoices,
  });

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
      showNotification({
        title: "Position Updated",
        message: "The position has been updated successfully.",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: "Update Failed",
        message: error.message || "Failed to update the position.",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions-tree"] });
      setSelectedNode(null);
      showNotification({
        title: "Position Deleted",
        message: "The position has been deleted successfully.",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: "Deletion Failed",
        message: error.message || "Failed to delete the position.",
        color: "red",
      });
    },
  });

  const handleNodeClick = (node: ExtendedTreeNodeData) => {
    setSelectedNode(node);
    setEditForm({
      name: node.label,
      description: node.description || "",
      parentId: node.parentId,
    });
  };

  const handleEdit = () => {
    if (selectedNode) {
      updateMutation.mutate({
        id: selectedNode.value,
        data: {
          name: editForm.name,
          description: editForm.description,
          parentId: editForm.parentId,
        },
      });
    }
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedNode) {
      deleteMutation.mutate(selectedNode.value);
    }
    setIsModalOpen(false);
  };

  if (isLoading) return <p>Loading positions...</p>;
  if (isError) return <p>Error fetching positions.</p>;

  const hierarchy = transformTreeToMantineTree(treeData || []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Notifications />
      <div className="flex justify-between items-center p-4 bg-gray-50 shadow-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Perago Information System Employee Hierarchy
        </h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          color="green"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
        >
          <IconPlus size={24} color="white" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-auto p-8 bg-gray-50">
        <div className="flex gap-8 w-full">
          <div className="flex-1 overflow-auto">
            <Tree
              data={hierarchy}
              levelOffset={30}
              className="custom-tree p-4 bg-white rounded-lg shadow-sm w-1/2"
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
                    onClick={() =>
                      handleNodeClick(node as ExtendedTreeNodeData)
                    }
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
                  <label className="block text-gray-600 font-medium mb-1">
                    Name
                  </label>
                  <TextInput
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    classNames={{
                      input:
                        "w-full border border-gray-300 rounded-md px-3 py-2 outline-none",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    minRows={3}
                  />
                </div>

                <div>
                  <select
                    value={editForm.parentId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, parentId: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-1 border-blue-100 outline-none transition"
                  >
                    <option value="">No Parent (Top-level Position)</option>
                    {positions?.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button
                  onClick={handleEdit}
                  loading={updateMutation.isPending}
                  color="green"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 shadow-sm transition"
                >
                  Update
                </Button>

                <Button
                  onClick={handleDelete}
                  color="red"
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 shadow-sm transition"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Position"
        size="lg"
        centered
      >
        <CreatePosition />
      </Modal>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
        centered
      >
        <p>Are you sure you want to delete this position?</p>
        <div className="flex justify-end gap-3 mt-5">
          <Button
            onClick={() => setIsModalOpen(false)}
            color="green"
            className="bg-gray-500 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="red"
            className="bg-red-500 text-white"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditPositions;

{
  /* <Select
                                label="Select Parent"
                                placeholder="Select Parent"
                                data={
                                  positions?.map((pos) => ({
                                    value: pos.parentId || "",
                                    label: pos.name,
                                  })) || []
                                }
                                defaultValue="React"
                                onChange={(value: any) => {
                                  setEditForm((pos) => ({ ...pos, parentId: value || "" }));
                                }}
                                clearable
                                searchable
                                style={{ width: "full"}}
                              /> */
}
