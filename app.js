"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var bodyParser = require("body-parser");
var compress = require("compression");
var config = require("./static/config.json");
var express = require("express");
var helper = require("./helper");
var http = require("http");
var morgan = require("morgan");
var path = require("path");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var app = express();
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.use(morgan("dev"));
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
helper.log("info", "Starting Server...", {
    "sFilename": "server",
    "bFile": config.debug,
    "bDatelog": false,
    "sColor": "magenta"
});
if (config.server.cluster) {
    require("sticky-cluster")(
        function (callback) {
            callback(server);
        }, {
            // number of workers to be forked (0 for all)
            concurrency: config.server.concurrency,
            // Localhost Port
            port: config.server.port
        });
} else {
    server.listen(config.server.port);
}
