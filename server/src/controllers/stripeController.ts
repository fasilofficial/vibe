import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import stripe from "../config/stripe";
import { CLIENT_URL, STORE_ITEMS } from "../constants";

export const createCheckoutSession = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const successUrl = `${CLIENT_URL}/features/bluetick/success?userId=${
        req.body.userId
      }&type=${STORE_ITEMS.get(req.body.items[0].id)?.type}`;

      const cancelUrl = `${CLIENT_URL}/features/bluetick/cancel?userId=${
        req.body.userId
      }&type=${STORE_ITEMS.get(req.body.items[0].id)?.type}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: req.body.items.map((item: any) => {
          const storeItem = STORE_ITEMS.get(item.id);
          return {
            price: storeItem?.priceId,
            quantity: item.quantity,
          };
        }),
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.log("Error creating checkout session:", error);
    }
  }
);
