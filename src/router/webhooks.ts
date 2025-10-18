// Stripe webhook
import express from "express";
import { createOnlineOrder } from "../modules/order/controller";

export const webhookRouter = (app: express.Express) => {
    app.post('/webhook', express.raw({type: 'application/json'}), createOnlineOrder);
};
