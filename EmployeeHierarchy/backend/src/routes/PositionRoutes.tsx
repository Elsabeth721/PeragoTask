import { Hono } from "hono";
import { createController, deleteController, getAllController, getByIdController, getChildrenController, updateController,  } from "../controller/PositionController.js";

const positionRoutes = new Hono()
.post("/", createController)
.put("/:id", updateController)
.get("/:id", getByIdController)
.get("/", getAllController)
.get("/:id/children", getChildrenController)
.delete("/:id", deleteController);

export default positionRoutes;
