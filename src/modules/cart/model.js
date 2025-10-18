import {Schema, model} from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.ObjectId,
            ref: "user",
        },
        cartItem: [
            {
                productId: {type: Schema.ObjectId, ref: "product"},
                quantity: {
                    type: Number,
                    default: 1
                },
                price: Number,
                totalProductDiscount: Number
            }
        ],
        totalPrice: Number,
        totalPriceAfterDiscount: Number,
        discount: Number
    },
    {
        timestamps: true,
    }
);

cartSchema.plugin(statusPlugin);

const Cart = model("Cart", cartSchema);
export {Cart};