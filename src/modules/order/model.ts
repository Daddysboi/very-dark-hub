import {Schema, model} from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";


const orderSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    cartItems: [
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
    shippingAddress: {
        street: String,
        city: String,
        phone: Number
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    deliveredAt: Date
})

orderSchema.plugin(statusPlugin);
const Order = model('Order', orderSchema)
export {Order}