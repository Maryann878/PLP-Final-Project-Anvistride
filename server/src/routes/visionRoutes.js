import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createVision,
  deleteVision,
  getVision,
  getVisions,
  updateVision,
} from "../controllers/visionController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getVisions).post(createVision);
router.route("/:id").get(getVision).put(updateVision).delete(deleteVision);

export default router;

