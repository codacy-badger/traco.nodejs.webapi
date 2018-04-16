"use strict";
//************************************************
// Modules
//************************************************
var fs = require("fs");
var path = require("path");

//************************************************
// require Prototypes
//************************************************
var sPath = "";
var sFile = "";
var sMaindir = path.join(__dirname);
var aFiles = fs.readdirSync(sMaindir); // eslint-disable-line
var i = 0;
while (i < aFiles.length) {
    if (aFiles[i].match(".js")) {
        sPath = aFiles[i].replace(sMaindir, "");
        sPath = sPath.replace(".js", "");
        sPath = sPath.replace(/\\/g, "/");
        sFile = sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
        if (sFile.indexOf("__template") === -1) {
            require(path.join(sMaindir, sFile));
        }
    }
    i += 1;
}
