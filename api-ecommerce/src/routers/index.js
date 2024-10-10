import express from "express";
import CategoryRouter from "./CategoryRouter";
import AttributeRouter from "./AttributeRouter";
import ProductRouter from "./ProductRouter";
import AuthRouter from "./AuthRouter";

const router = express.Router();

router.use("/categories", CategoryRouter);
router.use("/attributes", AttributeRouter);
router.use("/products", ProductRouter);
router.use("/auth", AuthRouter);

export default router;
