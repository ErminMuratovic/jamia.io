"use strict";

import * as cors from "cors";
import * as helmet from "helmet";
import * as logger from "morgan";
import * as express from "express";
import * as passport from "passport";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as compression from "compression";
import * as redisStore from "connect-redis";
import * as cookieParser from "cookie-parser";

import {configPassport} from "./config/auth";
import {JamiaRouter} from "./routers/jamia";
import {AuthRouter} from "./routers/auth";
import {FinanceRouter} from "./routers/finance";

let MONGODB_URL = "mongodb://mongodb/jamia";
let APP_SECRET = "AllahuEkber";

let RedisStore = redisStore(session);

mongoose.connect(MONGODB_URL, {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS
}).then(
    () => { console.info("app connected with mongodb://mongodb/jamia") },
    err => { console.error(err); }
);

let app = express();
let port = process.env.API_PORT || 5000;

if (app.get('env') === 'production') { // process.env.NODE_ENV
    // TODO: app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
    app.use(logger('dev'));
}

app.use(helmet());
app.use(compression());
app.use(bodyParser());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));
app.use(session({
    store: new RedisStore({
        url: "redis://redisstore"
    }),
    secret: APP_SECRET,
    name: "SESSION_ID",
    cookie: {
        secure: app.get('env') === 'production' ? true : false,
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
configPassport(passport);

app.use((req, res, next) => {
    if(!mongoose.connection.readyState)
        return res.status(500).send("Database offline.");
    next();
});

app.use("/auth", AuthRouter);
app.use("/jamia", JamiaRouter);
app.use("/finance", FinanceRouter);

let server = app.listen(port, () => {
    console.log('API listening on http://localhost:%s', server.address().port);
});