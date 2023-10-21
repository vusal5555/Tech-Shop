import express from "express";
import {
  getAllUsers,
  getSingleUser,
  authUser,
  registerUser,
  logoutUser,
  deleteUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getAllUsers).post(registerUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/login").post(authUser);
router.route("/logout").post(protect, logoutUser);
router
  .route("/:id")
  .get(protect, admin, getSingleUser)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

export default router;
