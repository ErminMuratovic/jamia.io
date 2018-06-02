"use strict";

import * as mongoose from "mongoose";

interface IAssetModel {
    path: String;
    group: String;
    title: String;
    created: Date;
    ref: mongoose.Schema.Types.ObjectId,
    refType: String;
    fileType: String;
}

interface IAsset extends IAssetModel, mongoose.Document{};

let assetSchema = new mongoose.Schema({
    path: String,
    group: String,
    title: String,
    created: { type: Date, default: new Date },
    ref: mongoose.Schema.Types.ObjectId,
    refType: String,
    fileType: String,
});

let Asset = mongoose.model<IAsset>("assets", assetSchema);
export {Asset, IAsset};