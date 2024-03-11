import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import stripe from "../config/stripe";

const CLIENT_URL = "http://localhost:3000";

const storeItems = new Map([
  [
    1,
    {
      priceInCents: 9900,
      name: "monthly",
      type: "month",
      priceId: "price_1Ot0laSFplNhK07RWIoxI6br",
    },
  ],
  [
    2,
    {
      priceInCents: 99000,
      name: "yearly",
      type: "year",
      priceId: "price_1Ot0lySFplNhK07RxcVbicuP",
    },
  ],
]);

export const SUBSCRIPTION_PLANS = [
  {
    id: 1,
    name: "Monthly Plan",
    price: "99",
    type: "month",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus excepturi, magni unde ad fugit consequuntur hic doloremque aspernatur? Officia, molestias. Officia.",
  },
  {
    id: 2,
    name: "Yearly Plan",
    price: "999",
    type: "year",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus excepturi, magni unde ad fugit consequuntur hic doloremque aspernatur? Officia, molestias. Officia.",
  },
];

export const createCheckoutSession = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const successUrl = `${CLIENT_URL}/features/bluetick/success?userId=${
        req.body.userId
      }&type=${storeItems.get(req.body.items[0].id)?.type}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: `${CLIENT_URL}/features/bluetick/cancel`,
        line_items: req.body.items.map((item: any) => {
          const storeItem = storeItems.get(item.id);
          return {
            // price_data: {
            //   currency: "inr",
            //   product_data: { name: storeItem?.name },
            // },
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
