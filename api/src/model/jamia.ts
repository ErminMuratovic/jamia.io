"use strict";

import * as mongoose from "mongoose";

interface IJamia {
    email: String;
    emailConfirmed: Boolean;
    created: Date;
    name: String;
    phone: String;
    mobilePhone: String;
    homepage: String;
    address: {
        street: String;
        number: String;
        postalCode: String;
        city: String;
        state: String;
        country: String;
        latitude: String;
        longitude: String;
        loc: {
            type: String,
            coordinates: Number[]
        };
    };
    profileImage: mongoose.Schema.Types.ObjectId;
    admin: [{
        user: mongoose.Schema.Types.ObjectId;
        role: String;
    }];
}

interface IJamiaDocument extends IJamia, mongoose.Document {};
interface IJamiaModel extends mongoose.Model<IJamiaDocument>{};

let JamiaSchema = new mongoose.Schema({
    email: String,
    emailConfirmed: Boolean,
    created: {type: Date, default: Date.now},
    name: String,
    phone: String,
    mobilePhone: String,
    homepage: String,
    address: {
        street: String,
        number: String,
        postalCode: String,
        city: String,
        state: String,
        country: String,
        latitude: String,
        longitude: String,
        loc: {
            type: String,
            coordinates: {type: Array}
        }
    },
    profileImage: {type: mongoose.Schema.Types.ObjectId, ref: "assets"},
    admin: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        role: String,
    }]
});

JamiaSchema.pre('save', next => {
    if(this.isModified('email') && this._email) {
        // Some condition that fires before save if the email changes ... or something.
        // Maybe we wanna fire off an email to the old address to let them know it changed
        console.log("%s has changed their email to %s", this._email, this.email);
    }
    next();
});

let Jamia = mongoose.model<IJamiaDocument, IJamiaModel>("jamias", JamiaSchema);
export {Jamia, IJamia};