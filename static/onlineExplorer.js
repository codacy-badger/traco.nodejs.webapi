var config = require("./config.json");
var path = require("path");
var express = require("express");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var colors = require("colors");
var url = require("url");

var __base = path.join(__dirname, "..");

var app = express();

// serve markdown files with content-type: text/plain in Firefox
app.use((req, res, next) => {
    if (/Firefox/.test(req.headers["user-agent"])) {
        var match = "\\.(?:markdown|mdown|mkdn|md|mkd|mdwn|mdtxt|mdtext|text)(?:#.*|\\?.*)?$";
        if (new RegExp(match).test(req.url)) {
            res.setHeader("content-type", "text/plain; charset=utf-8");
        }
    }
    var pathname = url.parse(req.url).pathname;
    console.log("Request: " + colors.yellow(pathname)); // eslint-disable-line
    next();
});

app.use(serveStatic(__base, {
    "dotfiles": "allow"
}));
app.use("/", serveIndex(__base, {
    "hidden": true,
    "icons": true,
    "view": "details"
}));

app.listen(8001);
console.log("Server running..."); // eslint-disable-line
