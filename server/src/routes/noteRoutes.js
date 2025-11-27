import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

export default router;

