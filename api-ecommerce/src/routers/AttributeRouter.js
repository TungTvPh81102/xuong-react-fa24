import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/AttributeController";

const AttributeRouter = express.Router();

AttributeRouter.get("/", index);
AttributeRouter.get("/:id", show);
AttributeRouter.post("/", store);
AttributeRouter.put("/:id", update);
AttributeRouter.delete("/:id", destroy);

export default AttributeRouter;
