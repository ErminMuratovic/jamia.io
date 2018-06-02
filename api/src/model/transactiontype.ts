"use strict";

import * as mongoose from "mongoose";

interface ITransactionTypeModel {
    abbreviation: String;
    name: String;
    jamia: mongoose.Schema.Types.ObjectId;
}

interface ITransactionType extends ITransactionTypeModel, mongoose.Document {};

let transactionTypeSchema = new mongoose.Schema({
    abbreviation: String,
    name: String,
    jamia: mongoose.Schema.Types.ObjectId
});

let TransactionType = mongoose.model<ITransactionType>("ttypes", transactionTypeSchema);
export {TransactionType, ITransactionType};