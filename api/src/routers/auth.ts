"use strict";

import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import {configPassport} from "../config/auth";

import {User} from "../model/user";
import {TransactionType} from "../model/transactiontype";

configPassport(passport);
let AuthRouter = express.Router();

let isAdmin = (req, res, next) => {
    if(!req.isAuthenticated())
        return res.status(401).send("Not Authenticated");
    if(!req.user.admin)
        return res.status(403).send("Unauthorized");
    next();
};

let isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return res.status(401).send("Not Authenticated");
    next();
};

AuthRouter.get("/", isLoggedIn, (req: any, res: any) => {
    res.send(req.user);
});

AuthRouter.post("/signup", passport.authenticate('local-signup'), (req: any, res: any) => {
    res.send(req.user);
});

AuthRouter.post("/", passport.authenticate('local-login'), (req: any, res: any) => {
    res.send(req.user);
});

AuthRouter.delete("/", (req: any, res: any) => {
    req.logout();
    res.send("Logout");
});

AuthRouter.post("/user", isAdmin, function (req: any, res: any) {
    let user = new User(req.body);
    user.save((err) => {
        if (err)
            return res.json({info: "Error during create", error: err});
        res.json({info: "User created successfully", data: user});
    });
});

AuthRouter.get("/user", isAdmin, function (req: any, res: any) {
    let query = User.find();

    if(req.query["jamia"])
        query.where("jamia", mongoose.Types.ObjectId(req.query["jamia"]));
    if(req.query["name"])
        query.regex("name", new RegExp(req.query["name"], "i"));

    query.sort('name');
    query
        .populate("jamia")
        .populate({path: 'transactions'})
        .select("-password")
        .exec((err, users) => {
            if (err)
                return res.status(500).send(err);
            res.json(users);
        });
});

export {AuthRouter};