"use strict";

import * as mongoose from "mongoose";

interface ITransactionModel {
    date: Date;
    transactionType: mongoose.Schema.Types.ObjectId;
    title: String;
    amount: Number;
    source: String;
    user: mongoose.Schema.Types.ObjectId;
    jamia: mongoose.Schema.Types.ObjectId;
}

interface ITransaction extends ITransactionModel, mongoose.Document {};

let transactionSchema = new mongoose.Schema({
    date: { type: Date, default: new Date },
    transactionType: { type: mongoose.Schema.Types.ObjectId, ref: "ttypes" },
    title: String,
    amount: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    jamia: { type: mongoose.Schema.Types.ObjectId, ref: "jamias" }
});

let Transaction = mongoose.model<ITransaction>("transactions", transactionSchema);
export {Transaction, ITransaction};