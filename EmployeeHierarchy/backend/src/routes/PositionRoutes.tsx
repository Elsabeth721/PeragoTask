import { Hono } from "hono";
import { createController, deleteController, getAllController, getByIdController, getChildrenController, updateController,  getChoicesController, getPositionsTreeController} from "../controller/PositionController.js";

const positionRoutes = new Hono()
.get("/choices", getChoicesController)
.get("/tree", getPositionsTreeController)
.post("/", createController)
.put("/:id", updateController)
.get("/:id", getByIdController)
.get("/", getAllController)
.get("/:id/children", getChildrenController)
.delete("/:id", deleteController);

export default positionRoutes;
