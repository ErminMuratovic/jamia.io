"use strict";

import * as moment from "moment";
import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";

import {Transaction} from "../model/transaction";
import {TransactionType} from "../model/transactiontype";

import {configPassport} from "../config/auth";

configPassport(passport);
let FinanceRouter = express.Router();

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

FinanceRouter.get("/transaction", isLoggedIn, function (req: express.Request, res: express.Response) {
    let query = Transaction.find();

    query.where("jamia", mongoose.Types.ObjectId(req.query["jamia"]));
    if(req.query["user"])
        query.where("user", mongoose.Types.ObjectId(req.query["user"]));
    if(req.query["transactionType"])
        query.where("transactionType", mongoose.Types.ObjectId(req.query["transactionType"]));
    if(req.query["name"])
        query.regex("name", new RegExp(req.query["name"], "i"));
    if(req.query["mindate"] && req.query["maxdate"])
        query.where("date", { "$gte": moment(req.query["mindate"]).toDate(), "$lte": moment(req.query["maxdate"]).toDate() });
    if(req.query["minamount"] && req.query["maxamount"])
        query.where("amount", { "$gte": moment(req.query["minamount"]).toDate(), "$lte": moment(req.query["maxamount"]).toDate() });
    else if(req.query["minamount"])
        query.where("amount", { "$gte": moment(req.query["minamount"]).toDate() });
    else if(req.query["maxamount"])
        query.where("amount", { "$lte": moment(req.query["maxamount"]).toDate() });

    query.populate("jamia");
    query.populate("user");
    query.populate("transactionType");
    query.exec((err, transactions) => {
        if (err)
            return res.status(500).send(err);
        res.json(transactions);
    });
});

FinanceRouter.get("/transactionType", isLoggedIn, function (req: express.Request, res: express.Response) {
    let query = TransactionType.find();
    query.exec((err, transactionTypes) => {
        if (err)
            return res.status(500).send(err);
        res.json(transactionTypes);
    });
});

FinanceRouter.post("/", isLoggedIn, function (req: express.Request, res: express.Response) {
    let transaction = new Transaction(req.body);
    transaction.save((err) => {
        if (err)
            return res.status(500).send(err);
        res.json(transaction);
    });
});

FinanceRouter.get("/transaction/:id", isLoggedIn, function (req: express.Request, res: express.Response) {
    Transaction
        .findById(req.params.id)
        .populate("transactionType")
        .exec((err, transaction) => {
            if (err)
                return res.status(500).send(err);
            else if (!transaction)
                return res.json({info: "Transaction not found with id:" + req.params.id});
            else
                res.json(transaction);
        });
});

FinanceRouter.get("/report", isLoggedIn, function (req: express.Request, res: express.Response) {
    let begin = moment([req.query["year"]]);
    let end = begin.endOf('year');

    let query = Transaction.find();
    query.where("jamia", mongoose.Types.ObjectId(req.query["jamia"]));
    query.where("date", { "$gte": begin, "$lte": end });
    query.populate({ path: "transactionType", model: TransactionType });
    query.where("amount", { "$gte": 0 });

    query.exec((err, incomingTransactions) => {
        if (err)
            return res.status(500).send(err);

        let query = Transaction.find();
        query.where("jamia", req.query["jamia"]);
        query.where("date", { "$gte": begin, "$lte": end });
        query.populate({ path: "transactionType", model: TransactionType });
        query.where("amount", { "$lte": 0 });

        query.exec((err, outgoingTransactions) => {
            if (err)
                return res.status(500).send(err);
            res.json({ incomingTransactions, outgoingTransactions });
        });
    });
});

export {FinanceRouter};