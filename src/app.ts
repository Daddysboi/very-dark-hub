import express, {Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import {dbConnection} from './config/dbConnection';
import {globalErrorHandler} from './middlewares/errorHandling';
import corsConfig from './config/corsConfig';
import envConfig from './config/envConfig';
import {rateLimiter} from "./config/rateLimit";
import {authMiddleware} from './config/auth0';
import {loadStartupData} from './handlers/startupLoader';
import routerConfig from "./router";
import serverConfig from "./config/server";
import {sessionConfig} from "./config/sessionConfig";
import {webhookRouter} from "./router/webhooks";

dotenv.config();
const port = envConfig.port;
const app: Express = express();

const start = async () => {
    await dbConnection();
    await loadStartupData();
    webhookRouter(app);
    app.set('trust proxy', 1);
    app.set('port', port);
    app.use(authMiddleware);
    app.use(cors(corsConfig));
    app.use(cookieParser());
    app.use(compression());
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({limit: '10mb', extended: false}));
    app.use(helmet());
    app.use(sessionConfig);
    rateLimiter(app)
    routerConfig(app);
    globalErrorHandler(app);
    serverConfig(app)
};

start();