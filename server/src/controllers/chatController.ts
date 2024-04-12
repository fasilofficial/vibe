import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Chat from "../models/Chat";
import { HttpStatusCode } from "../types";

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
        res
          .status(HttpStatusCode.NotFound)
          .json({ message: "Chats not found" });
      }

      res.status(HttpStatusCode.OK).json({ message: "chats", data: chats });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: "Internal server error" });
    }
  }
);

// add chat
export const addChat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      res.status(HttpStatusCode.BadRequest).json({ message: "Bad request" });
    }

    try {
      const chat = new Chat({ sender, receiver, message });
      await chat.save();

      await chat.populate({ path: "sender", model: "User" });
      await chat.populate({ path: "receiver", model: "User" });

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Chat added successfully", data: chat });
    } catch (error) {
      console.error("Error adding chat:", error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: "Failed to add chat" });
    }
  }
);
