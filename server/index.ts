import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRates } from "./routes/rates";

import { handleStripeWebhook } from "./routes/stripe";

export function createServer() {
  const app = express();

  // CORS first
  app.use(cors());

  // Stripe webhook must get raw body. Register BEFORE json/urlencoded.
  app.post("/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

  // Other middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/rates", handleRates);

  return app;
}
