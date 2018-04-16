"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Globals
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("./prototype/loadPrototype");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var http = require("http");
var path = require("path");
var express = require("express");
var compress = require("compression");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var logger = require("./module/simple-file-logger");
var config = require("./static/config.json");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var app = express();
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
// app.use(morgan(":user-agent"));
switch (config.debug.mode) {
    case ("dev"):
        app.use(morgan("dev"));
        break;
    case ("build"):
        app.use(morgan(":method :status :url | :response-time ms - :res[content-length] B"));
        break;
    default:
        app.use(morgan());
        break;
}
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({
    "extended": true
}));
app.use(bodyParser.json());
app.use(compress({
    "level": 9,
    "threshold": 0
}));

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Routes
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("./controllers/index")(app);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SERVER START
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var server = http.createServer(app);
logger.log("info", "Starting Server...", {
    "sFilename": "server",
    "bFile": config.debug.enabled,
    "bDatelog": false,
    "sColor": "magenta"
});
if (config.server.main.cluster) {
    require("sticky-cluster")(
        function (callback) {
            callback(server);
        }, {
            // number of workers to be forked (0 for all)
            concurrency: config.server.main.concurrency,
            // Localhost Port
            port: config.server.main.port
        });
} else {
    server.listen(config.server.main.port);
}
