"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPositionChoices, createPosition } from "../api/positionApi";
import { Button, Select, Textarea, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const CreatePosition = () => {
  const [position, setPosition] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const queryClient = useQueryClient();

  const { data: positions, isLoading: isFetching } = useQuery({
    queryKey: ["choices"],
    queryFn: fetchPositionChoices,
  });
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [parentId, setParentId] = useState("");
  // const [message, setMessage] = useState("");
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 

  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choices"] });
      // setMessage("Position added successfully!");
      showNotification({
        title: "Create Position",
        message: "Position successfully added",
        color: "green",
      });
      setPosition({
        name: "",
        description: "",
        parentId: "",
      });
    },
    // setName("");
    // setDescription("");
    // setParentId("");
    // setErrorMessage("");

    // onError: (error: Error) => {
    //   console.log('here is the error ',error.message)
    //   setErrorMessage(error.message || "Failed to add position.");
    //   setMessage("");
    // },
    onError: (error: Error) => {
      showNotification({
        title: "Creating Position Failed",
        message: error.message || "Failed to Create Position",
        color: "red",
      });
    },
  });

  const handleAddPosition = async () => {
    if (!position.name) {
      setErrorMessage("Position name is required.");
      return;
    }

    const newPosition = {
      name: position.name,
      description: position.description,
      parentId: position.parentId || "",
    };

    mutation.mutate(newPosition);
  };
  const data = positions?.map((pos) => ({
    value: pos.id,
    label: pos.name,
  })) || [];

  return (
    <div className="flex justify-center items-center  bg-gray-100 p-5">
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
            <TextInput
              type="text"
              value={position.name}
              onChange={(e) =>
                setPosition((pos) => ({ ...pos, name: e.target.value }))
              }
              placeholder="Position Name"
              classNames={{
                input:
                  "w-full border border-gray-300 rounded-md px-3 py-2 outline-none",
              }}
            />

            <Textarea
              value={position.description}
              onChange={(e) =>
                setPosition((pos) => ({ ...pos, description: e.target.value }))
              }
              placeholder="Description (optional)"
              // className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none  transition resize-none"
              rows={3}
            />
            <select 
              value={position.parentId}
              onChange={(e) => setPosition((pos) => ({ ...pos, parentId: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border-1 border-blue-100 outline-none transition"
            >
              <option value="">No Parent (Top-level Position)</option>
              {positions?.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>

            <Button
              onClick={handleAddPosition}
              color="green"
              className="w-full hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition ease-in"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Position"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;



{/* {message && <p className="text-green-500 text-center">{message}</p>}
            {errorMessage && (
              <p className="text-red-500 text-center whitespace-pre-line">{errorMessage}</p>
            )} */}
 {/* <Select
              label="Select Parent"
              placeholder="Select Parent"
              data={
                positions?.map((pos) => ({
                  value: pos.id,
                  label: pos.name,
                })) || []
              }
              defaultValue="No parent"
              onChange={(value) => {
                setPosition((pos) => ({ ...pos, parentId: value || "" }));
              }}
              clearable
              searchable
              style={{ width: "full"}}
            /> */}