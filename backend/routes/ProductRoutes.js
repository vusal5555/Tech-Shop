import express from "express";
import {
  getAllProducts,
  getSingProduct,
  createProduct,
  deleteProduct,
  editProduct,
  createReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router.route("/top").get(getTopProducts);
router
  .route("/:id")
  .get(getSingProduct)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, editProduct);

router.route("/:id/reviews").post(protect, createReview);

export default router;
