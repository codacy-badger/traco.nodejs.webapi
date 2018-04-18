"use strict";
/*
var fs = require("fs");
var path = require("path");

var firstLetterUpperCase = function (sString) {
    return sString[0].toUpperCase() + sString.substr(1);
};

var sPath = "";
var sFile = "";
var sMaindir = path.join(__dirname, "classes");
var aFiles = fs.readdirSync(sMaindir); // eslint-disable-line
var i = 0;
while (i < aFiles.length) {
    if (aFiles[i].match(".js")) {
        sPath = aFiles[i].replace(sMaindir, "");
        sPath = sPath.replace(".js", "");
        sPath = sPath.replace(/\\/g, "/");
        sFile = sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
        if (sFile.indexOf("__template") === -1) {
            var oRequire = require(path.join(sMaindir, sFile));
            if (oRequire.class !== undefined && typeof oRequire.class === "function") {
                exports[firstLetterUpperCase(sFile)] = oRequire.class;
            }
        }
    }
    i += 1;
}
*/

exports.User = require("./classes/user");
