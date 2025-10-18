import express from "express";

import * as order from "./controller.ts"

const orderRouter = express.Router();


orderRouter
    .route("/:id")
    .post(
        order.createCashOrder
    )
orderRouter
    .route("/")
    .get(
        order.getSpecificOrder
    )

orderRouter.post('/checkOut/:id', order.createCheckOutSession)

orderRouter.get('/all', order.getAllOrders)
export default orderRouter;
