"use strict";

import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as logger from "morgan";

import * as Jamia from "./model/jamia";
// TODO: import * as database from "./model/database";

/**
 * The application.
 *
 * @class App
 */
class App {

    public app:express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap():App {
        return new App();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //configure routes
        this.routes();
    }

    /**
     * Configure application
     *
     * @class App
     * @method config
     * @return void
     */
    private config() {
        //configure database
        // TODO: database.connect("mongodb://localhost/jamiadb");
        mongoose.connect("mongodb://localhost/mydb");

        //configure jade
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "jade");

        //mount logger
        this.app.use(logger("dev"));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({extended: true}));

        //add static paths
        // this.app.use(express.static(path.join(__dirname, "public")));
        // this.app.use(express.static(path.join(__dirname, "bower_components")));

        // catch 404 and forward to error handler
        this.app.use(function (err:any, req:express.Request, res:express.Response, next:express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });

        this.app.listen(3000, function () {
            console.log("App listening on port 3000");
        });
    }

    /**
     * Configure routes
     *
     * @class App
     * @method routes
     * @return void
     */
    private routes() {
        //get router
        let router:express.Router;
        router = express.Router();

        //API endpoints

        router.get("/", (req: express.Request, res:express.Response) => {
            res.json({
                message: "Hello World!"
            });
        });

        /* Create */
        router.post("/jamia", function (req:express.Request, res:express.Response) {
            var newJamia = new Jamia(req.body);
            newJamia.save((err)=> {
                if (err) {
                    res.json({info: "error during create", error: err});
                }
                res.json({info: "Jamia created successfully", data: newJamia});
            });
        });

        /* Read all */
        router.get("/jamia", function (req: express.Request, res: express.Response) {
            Jamia.find((err:mongoose.MongoError, jamias:any[]) => {
                if (err) {
                    res.json({info: "error during find Jamias", error: err});
                }
                ;
                res.json({info: "Jamias found successfully", data: jamias});
            });
        });

        /* Find one */
        router.get("/jamia/:id", function (req: express.Request, res: express.Response) {
            var query = {id: req.params.isd};
            Jamia.findOne(query, function (err:mongoose.MongoError, user:any) {
                if (err) {
                    res.json({info: "error during find Jamia", error: err});
                }
                if (user) {
                    res.json({info: "Jamia found successfully", data: user});
                } else {
                    res.json({info: "Jamia not found with id:" + req.params.id});
                }
            });
        });

        //use router middleware
        this.app.use("/api", router);
    }
}

export default App.bootstrap().app;