"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePosition, Position } from "../api/positionApi";

interface EditPositionProps {
  position: Position;
}

const EditPosition = ({ position }: EditPositionProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(position.name);
  const [description, setDescription] = useState(position.description);
  const [parentId, setParentId] = useState<string | null>(position.parentId);

  const mutation = useMutation<Position, Error, Partial<Position>>({
    mutationFn: (updatedData) => updatePosition(position.id, updatedData), // Mutation function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] }); // Refresh the positions list
      alert("Position updated successfully!");
    },
    onError: (error: Error) => {
      alert(`Error updating position: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, description, parentId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Position</h3>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Parent ID (optional):</label>
        <input
          type="text"
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || null)}
        />
      </div>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditPosition;