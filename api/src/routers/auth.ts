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
    let query = {};
    let options = {};

    if(req.query["jamia"])
        query["jamia"] = req.query["jamia"];
    if(req.query["name"])
        query["name"] = new RegExp(req.query["name"], "i");

    options["select"] = "-password";
    options["sort"] = "name";
    options["populate"] = ["jamia", "transactions", "transactions.transactionTypes"];

    if(req.query.page && req.query.pageSize) {
        options["page"] = Number(req.query.page);
        options["limit"] = Number(req.query.pageSize);
    }

    User.paginate(query, options).then((result) => {
        res.json(result);
    });
});

AuthRouter.get("/user/:id", isAdmin, function (req: any, res: any) {
    User.findById(req.params.id)
        .exec((err, user) => {
            if (err)
                return res.status(500).send(err);
            else if (!user)
                return res.status(404).send();
            else
                return res.send(user);
        });
});

export {AuthRouter};