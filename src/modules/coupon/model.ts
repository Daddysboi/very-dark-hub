import {Schema, model} from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        expires: {
            type: Date,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {timestamps: true}
);

couponSchema.plugin(statusPlugin);
const Coupon = model("coupon", couponSchema);
export {Coupon};
