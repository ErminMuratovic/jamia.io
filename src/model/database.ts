"use strict";

import * as mongoose from "mongoose";

/**
 * The database.
 *
 * @class Database
 */
class Database {

    /**
     * Constructor.
     *
     * @class Database
     * @constructor
     */
    constructor() {
        console.log("constructor");
    }

    /**
     * Connect database.
     *
     * @class Database
     * @method connect
     * @param {}
     * @return void
     */
    private connect() {
        mongoose.connect("mongodb://localhost/nodewebappdb");
    }
}

export = Database;