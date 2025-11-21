// server/src/routes/chatRoutes.js
import express from "express";
import {
  getGroupChat,
  getPrivateChat,
  getUserChats,
  sendMessage,
  getChatMessages,
  getOnlineUsers,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.get("/group", getGroupChat);
router.get("/private/:userId", getPrivateChat);
router.get("/", getUserChats);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/message", sendMessage);
router.get("/users/online", getOnlineUsers);

export default router;

