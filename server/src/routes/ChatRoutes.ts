import express from "express";
import { addChat, getChats } from "../controllers/chatController";

const router = express.Router();

// get chats
router.get("/", getChats);

// add chat
router.post("/", addChat);

export default router;
