"use strict";

import * as mongoose from "mongoose";

interface IJamia {
    name:string;
    address:string;
    email:string;
}

interface IJamiaModel extends IJamia, mongoose.Document{};

var dzematSchema = new mongoose.Schema({
    name: String,
    address: String,
    email: String,
});

var Jamia = mongoose.model<IJamiaModel>("Jamia", dzematSchema);

export = Jamia;