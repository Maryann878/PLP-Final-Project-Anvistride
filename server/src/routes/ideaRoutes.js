import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createIdea,
  deleteIdea,
  getIdea,
  getIdeas,
  updateIdea,
} from "../controllers/ideaController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getIdeas).post(createIdea);
router.route("/:id").get(getIdea).put(updateIdea).delete(deleteIdea);

export default router;

