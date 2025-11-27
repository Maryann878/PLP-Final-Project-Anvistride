import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRecycleItem,
  getRecycleItems,
  getRecycleItem,
  restoreItem,
  deleteRecycleItem,
  clearRecycleBin,
} from "../controllers/recycleBinController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getRecycleItems).post(createRecycleItem).delete(clearRecycleBin);
router.route("/:id").get(getRecycleItem).delete(deleteRecycleItem);
router.route("/:id/restore").post(restoreItem);

export default router;

