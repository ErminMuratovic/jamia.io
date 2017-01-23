"use strict";

import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

interface IJamia {
    name:string;
    address:string;
    email:string;
    createdAt:Date;
}

interface IJamiaModel extends IJamia, mongoose.Document{};

let JamiaSchema = new Schema({
        name: { type: String },
        address: { type: String },
        email: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }, {
        versionKey: false
    });
JamiaSchema.pre('save', next => {
    let now = new Date();
    if(!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

var Jamia = mongoose.model<IJamiaModel>("Jamia", JamiaSchema);
export = Jamia;