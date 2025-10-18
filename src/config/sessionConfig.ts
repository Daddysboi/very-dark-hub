import envConfig from "./envConfig";
import session from "express-session";
import MongoStore from "connect-mongo";
import {MILLISECONDS_IN_A_SECOND, MINUTES_IN_AN_HOUR, SECONDS_IN_A_MINUTE} from "../utils/constants";

const isProduction = envConfig.env === "production";

export const sessionConfig = () => {
    return session({
        secret: envConfig.session.secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: envConfig.mongodbUrl,
        }),
        cookie: {
            secure: isProduction,
            httpOnly: true,
            sameSite: "strict",
            maxAge:
                MILLISECONDS_IN_A_SECOND *
                SECONDS_IN_A_MINUTE *
                MINUTES_IN_AN_HOUR,
        },
        name: "__Secure-sessionId",
    });
};
