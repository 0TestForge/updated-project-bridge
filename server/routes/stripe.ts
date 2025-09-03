import type { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sig = req.header("stripe-signature") || "";
  const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe] signature verification failed", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // const session = event.data.object as Stripe.Checkout.Session;
        break;
      case "payment_intent.succeeded":
        // const pi = event.data.object as Stripe.PaymentIntent;
        break;
      case "setup_intent.created":
        // const si = event.data.object as Stripe.SetupIntent;
        break;
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("[stripe] handler error", e);
    return res.status(500).send("handler error");
  }
}
