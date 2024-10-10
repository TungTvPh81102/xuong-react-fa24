import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/CategoryController";
import { authMiddleware, roleMiddleware } from "../middlewares/AuthMiddleware";
import { requestBody } from "../middlewares/RequestBody";
import { categoryRequest } from "../validation/CategoryRequest";

const CategoryRouter = express.Router();

const adminMiddleware = [authMiddleware, roleMiddleware("admin")];

CategoryRouter.get("/", index);
CategoryRouter.get("/:id", show);
CategoryRouter.post("/", adminMiddleware, requestBody(categoryRequest), store);
CategoryRouter.put(
  "/:id",
  adminMiddleware,
  requestBody(categoryRequest),
  update
);
CategoryRouter.delete("/:id", adminMiddleware, destroy);

export default CategoryRouter;
