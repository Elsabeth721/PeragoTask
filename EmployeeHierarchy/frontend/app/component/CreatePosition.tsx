"use client"; 

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPositionChoices, createPosition } from "../api/positionApi";
import { notifications } from "@mantine/notifications";

const CreatePosition = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  const queryClient = useQueryClient();

  const { data: positions, isLoading: isFetching } = useQuery({
    queryKey: ["choices"],
    queryFn: fetchPositionChoices,
  });

  const mutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choices"] });
      notifications.show({
        title: "Success",
        message: "Position created successfully!",
        color: "green",
        autoClose: 5000,
        withCloseButton: true,
      });

      setName("");
      setDescription("");
      setParentId("");
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Failure",
        message: error.message || "Failed to add position.",
        color: "red",
        autoClose: 5000,
        withCloseButton: true,
      });
    },
  });

  const handleAddPosition = async () => {
    if (!name) {
      notifications.show({
        title: "Warning",
        message: "Position name is required.",
        color: "yellow",
        autoClose: 1500,
        withCloseButton: true,
      });
      return;
    }

    const newPosition = {
      name,
      description,
      parentId: parentId || null,
    };

    mutation.mutate(newPosition);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 ">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex max-w-4xl w-full">
        <div className="w-1/2 hidden md:block">
          <img
            src="/form.jpg"
            alt="Form Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
            Add New Position
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Position Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 transition outline-none"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none transition resize-none"
              rows={3}
            ></textarea>

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none transition"
            >
              <option value="">No Parent (Top-level Position)</option>
              {positions?.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddPosition}
              className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg transition ease-in "
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Position"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;