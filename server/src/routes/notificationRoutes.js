import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getNotifications).post(createNotification);
router.route("/read-all").put(markAllAsRead);
router.route("/read").delete(clearReadNotifications);
router.route("/:id").get(getNotification).delete(deleteNotification);
router.route("/:id/read").put(markAsRead);

export default router;

