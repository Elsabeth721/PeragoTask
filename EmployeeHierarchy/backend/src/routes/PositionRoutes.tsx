import { Hono } from "hono";
import { createController, deleteController, getAllController, getByIdController, getChildrenController, updateController,  getChoicesController, getPositionsTreeController, getPaginationController} from "../controller/PositionController.js";
import { zValidator } from "@hono/zod-validator";
import { positionSchema } from "../validator/zodvalidator.js";
import { HTTPException } from "hono/http-exception";

const positionRoutes = new Hono()
.get('/pagination', getPaginationController)
.get("/choices", getChoicesController)
.get("/tree", getPositionsTreeController)
.post("/",
     zValidator("json", positionSchema, (result, c)=>{
    if (!result.success){
        console.log("Zod is working",result.error.errors[0].message )
        throw new HTTPException(400, {message: result.error.errors[0].message})
    }

}), 
createController)
.put("/:id", updateController)
.get("/:id", getByIdController)
.get("/", getAllController)
.get("/:id/children", getChildrenController)
.delete("/:id", deleteController)

export default positionRoutes;
