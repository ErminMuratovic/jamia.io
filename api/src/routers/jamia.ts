"use strict";

import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";

import {Jamia} from "../model/jamia";
import {configPassport} from "../config/auth";

configPassport(passport);
let JamiaRouter = express.Router();

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

/**
 * @api {get} / Retrieve jamia
 * @apiName GetJamia
 * @apiGroup JamiaRouter
 *
 * @apiDescription Retrieve jamia
 *
 * @apiParam {String} id Optional Id of Jamia
 *
 * @apiSuccess {Object[]} data Array of jamia
 */
JamiaRouter.get("/", isAdmin, function (req: express.Request, res: express.Response) {
    let query = Jamia.find();

    if(req.query["name"])
        query.regex("name", new RegExp(req.query["name"], "i"));

    query.exec((err, jamias) => {
        if (err)
            return res.status(500).send(err);

        if(req.query["admin"])
            jamias = jamias.filter((jamia) => {
                return jamia["admin"].filter(a => a["user"] == req.query["admin"]).length > 0;
            });

        res.json(jamias);
    });
});

JamiaRouter.post("/", isAdmin, function (req: express.Request, res: express.Response) {
    let jamia = new Jamia(req.body);
    jamia.save((err) => {
        if (err)
            return res.status(500).send(err);
        res.json(jamia);
    });
});

JamiaRouter.get("/:id", isLoggedIn, function (req: express.Request, res: express.Response) {
    Jamia.findById(req.params.id).exec((err: mongoose.MongoError, jamia: any) => {
        if (err)
            return res.status(500).send(err);
        else if (!jamia)
            return res.json({info: "Jamia not found with id:" + req.params.id});
        else
            res.json(jamia);
    });
});

export {JamiaRouter};