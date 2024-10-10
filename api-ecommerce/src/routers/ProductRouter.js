import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/ProductController";
import { requestBody } from "../middlewares/RequestBody";
import { productRequest } from "../validation/ProductRequest";
import { authMiddleware, roleMiddleware } from "../middlewares/AuthMiddleware";

const ProductRouter = express.Router();
const adminMiddleware = [authMiddleware, roleMiddleware("admin")];

ProductRouter.get("/", index);
ProductRouter.get("/:id", show);
ProductRouter.post("/", adminMiddleware, requestBody(productRequest), store);
ProductRouter.put("/:id", adminMiddleware, requestBody(productRequest), update);
ProductRouter.delete("/:id", adminMiddleware, destroy);

export default ProductRouter;
