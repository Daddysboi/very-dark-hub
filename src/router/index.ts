import express, {Request, Response, NextFunction} from 'express';
import categoryRouter from '../modules/category/routes';
import subCategoryRouter from '../modules/subcategory/routes';
import brandRouter from '../modules/brand/routes';
import productRouter from '../modules/product/routes';
import userRouter from '../modules/user/routes';
import authRouter from '../modules/auth/routes';
import reviewRouter from '../modules/review/routes';
import wishListRouter from '../modules/wishlist/routes';
import couponRouter from '../modules/coupon/routes';
import cartRouter from '../modules/cart/routes';
import orderRouter from '../modules/order/routes';
import httpStatus from 'http-status';
import AppError from "../utils/AppError";
import {healthCheck} from "../handlers/healthcheck";
import addressRouter from "../modules/address/routes";
import supportRouter from "../modules/contact-support/route";
import mailingListRouter from "../modules/mailing-list/route";
import {requiresAuth} from "express-openid-connect";
import envConfig from "../config/envConfig";

const routerConfig = (app: express.Express): void => {
    const isProduction = envConfig.env === 'production';

    app.get('/', healthCheck);

    //TODO: Implement google log in. still in implementation/testing hence !isProduction flag
    if (!isProduction) {
        app.get('/profile', requiresAuth(), (req, res) => {
            res.send(JSON.stringify(req.oidc.user));
        });
    }

    const apiV1Router = express.Router();
    apiV1Router.use('/categories', categoryRouter);
    apiV1Router.use('/subcategories', subCategoryRouter);
    apiV1Router.use('/brands', brandRouter);
    apiV1Router.use('/products', productRouter);
    apiV1Router.use('/users', userRouter);
    apiV1Router.use('/auth', authRouter);
    apiV1Router.use('/reviews', reviewRouter);
    apiV1Router.use('/wishlists', wishListRouter);
    apiV1Router.use('/coupons', couponRouter);
    apiV1Router.use('/carts', cartRouter);
    apiV1Router.use('/orders', orderRouter);
    apiV1Router.use('/addresses', addressRouter);
    apiV1Router.use('/support', supportRouter);
    apiV1Router.use('/subscribe', mailingListRouter);
    app.use('/api/v1', apiV1Router);

    app.use((_req: Request, _res: Response, next: NextFunction) => {
        next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
    });
}


export default routerConfig