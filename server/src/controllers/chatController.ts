import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Chat from "../models/Chat";

// get chats
export const getChats = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const chats = await Chat.find({})
        .populate({
          path: "sender",
          model: "User",
        })
        .populate({
          path: "receiver",
          model: "User",
        });

      if (!chats) {
        res.status(404).json({ message: "Chats not found" });
      }

      res.status(200).json({ message: "chats", data: chats });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// add chat
export const addChat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      res.status(400).json({ message: "Bad request" });
    }

    try {
      const chat = new Chat({ sender, receiver, message });
      await chat.save();

      await chat.populate({ path: "sender", model: "User" });
      await chat.populate({ path: "receiver", model: "User" });

      res.status(200).json({ message: "Chat added successfully", data: chat });
    } catch (error) {
      console.error("Error adding chat:", error);
      res.status(500).json({ message: "Failed to add chat" });
    }
  }
);
