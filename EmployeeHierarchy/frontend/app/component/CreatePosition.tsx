"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPositionChoices, createPosition } from "../api/positionApi";

const CreatePosition = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  // Fetch positions using TanStack Query
  const { data: positions, isLoading: isFetching } = useQuery({
    queryKey: ["choices"],
    queryFn: fetchPositionChoices,
  });

  console.log("Positions from useQuery:", positions);

  // Mutation for creating a new position
  const mutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choices"] });
      setMessage("Position added successfully!");
      setName("");
      setDescription("");
      setParentId("");
    },
    onError: (error) => {
      console.error("Error creating position:", error);
      setMessage("Failed to add position.");
    },
  });

  const handleAddPosition = async () => {
    if (!name) {
      setMessage("Position name is required.");
      return;
    }

    const newPosition = {
      name,
      description,
      parentId: parentId || null, // Send the ID of the parent position
    };

    mutation.mutate(newPosition);
  };

  return (
    <div className="flex justify-center m-10">
      <div className="m-10 p-10 border rounded-lg shadow-md bg-white max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2 text-center">Add New Position</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Position Name"
          className="border p-1 mb-3 w-full rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="border p-1 mb-3 w-full rounded"
        />
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border p-1 mb-3 w-full rounded"
        >
          <option value="">No Parent (Top-level Position)</option>
          {positions?.map((pos) => (
            <option key={pos.id} value={pos.id}> {/* Use pos.id as the value */}
              {pos.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddPosition}
          className="bg-green-500 text-white p-1 w-full rounded hover:bg-green-600 transition ease-in"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add Position"}
        </button>
        {message && <p className="text-green-500 mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default CreatePosition;