"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var bodyParser = require("body-parser");
var compress = require("compression");
var config = require("./static/config.json");
var express = require("express");
var http = require("http");
var morgan = require("morgan");
var path = require("path");
var logger = require("./module/logger");
var Logger = new logger.Logger({
    sFilename: "server",
    bFiledate: false,
    bAutodel: false
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var app = express();
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.use(morgan(config.server.mode));
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
Logger.log("Starting Server...\nRunning on port " + config.server.port, 1);
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
