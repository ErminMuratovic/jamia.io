"use strict";

import * as mongoose from "mongoose";

/**
 * The database.
 *
 * @class Database
 */
export class Database {

    private db_base_uri:string;
    private db_name:string;

    /**
     * Constructor.
     *
     * @class Database
     * @constructor
     */
    constructor() {
        this.db_base_uri = process.env.DB_URI || "mongodb://localhost";
        this.db_name = "/jamiaiodb";
    }

    /**
     * Connect database.
     *
     * @class Database
     * @method connect
     * @param {}
     * @return void
     */
    public connect() {
        mongoose.connect(this.db_base_uri+this.db_name);
    }
}