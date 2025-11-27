import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
} from "../controllers/journalController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getJournalEntries).post(createJournalEntry);
router
  .route("/:id")
  .get(getJournalEntry)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

export default router;

