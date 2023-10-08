import express from "express";
import {
  getAllProducts,
  getSingProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getAllProducts);

router.route("/:id").get(getSingProduct);

export default router;
