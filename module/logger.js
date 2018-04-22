"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var fs = require("fs-extra");
var path = require("path");
var colors = require("colors");
var date = require("./eNativ/date");
var enums = require("../static/enums.json");
var bluebird = require("bluebird");

/**
 * @default
 * @private
 */
var oConfig = {
    bConsole: true,
    sColor: ".",

    bFile: true,
    bFiledate: true,
    sFilename: "log",
    sExtension: "log",
    sPath: path.join(__dirname, "..", ".tmp"),
    iSaveDays: 7,
    bLogdate: true,
    bLogtyp: true
};

var sMess = "";

var dtDeleted = Date.now();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var promiseWhile = bluebird.method(function (condition, action) {
    if (!condition()) {
        return;
    }
    return action().then(promiseWhile.bind(null, condition, action));
});

var _setOptions = function (oOptions) { // eslint-disable-line
    /* eslint-disable curly */
    if (!oOptions) oOptions = {};
    if (!oOptions.bConsole && oOptions.bConsole !== undefined) oConfig.bConsole = false;
    if (oOptions.sColor) oConfig.sColor = oOptions.sColor;

    if (!oOptions.bFile && oOptions.bFile !== undefined) oConfig.bFile = false;
    if (!oOptions.bFiledate && oOptions.bFiledate !== undefined) oConfig.bFiledate = false;
    if (oOptions.sFilename) oConfig.sFilename = oOptions.sFilename;
    if (oOptions.sExtension) oConfig.sExtension = oOptions.sExtension;
    if (oOptions.sPath) oConfig.sPath = path.join(__dirname, "..", oOptions.sPath);
    if (oOptions.iSaveDays) oConfig.iSaveDays = oOptions.iSaveDays;
    if (!oOptions.bLogdate && oOptions.bLogdate !== undefined) oConfig.bLogdate = false;
    if (!oOptions.bLogtyp && oOptions.bLogtyp !== undefined) oConfig.bLogtyp = false;
    /* eslint-enable curly */
};

var _setMessage = function (sMessage, sType) {
    sMess = "";
    if (oConfig.bLogdate) {
        sMess += "[" + date.logDate() + "] ";
    }
    if (oConfig.bLogtyp) {
        sMess += " [ " + sType + " ]  ";
    }
    sMess += sMessage;
};

var _logConsole = function (sMessage, sType) {
    /* eslint-disable no-console */
    var sHead = " ---- " + sType + " ---- ";
    if (colors[oConfig.sColor]) {
        console.log(colors[oConfig.sColor](sHead));
    } else {
        console.log(colors.magenta(sHead));
    }
    console.log(colors.grey(date.logDate()));
    console.log(sMessage);
    /* eslint-enable no-console */
};

var _delOldFiles = function () {
    if (Date.now() < dtDeleted + enums.Hour * 1000) {
        return;
    }
    var i = 0;
    var iFiles = 0;
    fs.readdir(oConfig.sPath)
        .then(function (aFiles) {
            iFiles = aFiles.length;
            return promiseWhile(function () {
                return i < iFiles;
            }, function () {
                return fs.stat(path.join(oConfig.sPath, aFiles[i]))
                    .then(function (oStats) {
                        if (oStats.mtimeMs + enums.Days * oConfig.iSaveDays <= Date.now()) {
                            return fs.unlink(path.join(oConfig.sPath, aFiles[i]));
                        }
                    })
                    .then(function () {
                        i += 1;
                    });
            });
        })
        .then(function () {
            dtDeleted = Date.now();
        })
        .catch(function (err) {
            console.log("logger ERROR in delete file: " + err.code); // eslint-disable-line
        });
};

var _logFile = function () {
    _delOldFiles();
    var sFile = "";

    sFile += oConfig.sFilename;
    if (oConfig.iSaveDays * enums.Day < enums.Minute) {
        oConfig.iSaveDays = enums.Minute;
    }
    if (oConfig.bFiledate) {
        sFile += "_" + date.logFileDate();
        switch (true) {
            case oConfig.iSaveDays * enums.Day < enums.Day && oConfig.iSaveDays * enums.Day >= enums.Hour:
                sFile += "-" + date.genDate("hh");
                break;
            case oConfig.iSaveDays * enums.Day < enums.Hour && oConfig.iSaveDays * enums.Day >= enums.Minute:
                sFile += "-" + date.genDate("hhmm");
                break;
            default:
        }
    }
    sFile += "." + oConfig.sExtension;
    sMess = sMess.replace(/\r/g, "	"); // eslint-disable-line
    sMess = sMess.replace(/\n/g, "	"); // eslint-disable-line
    fs.appendFile(path.join(oConfig.sPath, sFile), sMess + "\n")
        .then(function () {
            // console.log("The " + sFile + ".log file was saved!");
        })
        .catch(function (err) {
            console.log("logger ERROR in write file: " + err.code); // eslint-disable-line
        });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Logging a spezific Message in  log-File
 * @param {string} sMessage
 * @param {string} sType
 * @param {Object} [oOptions]
 * @param {Boolean} [oOptions.bConsole]
 * @param {string} [oOptions.sColor]
 * @param {Boolean} [oOptions.bFile]
 * @param {Boolean} [oOptions.bFiledate]
 * @param {string} [oOptions.sFilename]
 * @param {string} [oOptions.sExtension]
 * @param {string} [oOptions.sPath]
 * @param {number} [oOptions.iSaveDays]
 * @param {Boolean} [oOptions.bLogdate]
 * @param {Boolean} [oOptions.bLogtyp]
 * @returns {void}
 */
exports.log = function (sMessage, sType, oOptions) {
    if (!sMessage) {
        sMessage = "";
    }
    if (typeof sType === "number") {
        const code = ["DEBUG", "INFO", "WARN", "ERROR"];
        sType = code[sType];
    }
    if (!sType) {
        sType = "INFO";
    }
    _setOptions(oOptions);
    _setMessage(sMessage, sType);
    if (oConfig.bConsole) {
        _logConsole(sMessage, sType);
    }
    if (oConfig.bFile) {
        _logFile();
    }
};

/**
 * require for this modul.
 * @param {Object} [oOptions]
 * @param {Boolean} [oOptions.bConsole]
 * @param {string} [oOptions.sColor]
 * @param {Boolean} [oOptions.bFile]
 * @param {Boolean} [oOptions.bFiledate]
 * @param {string} [oOptions.sFilename]
 * @param {string} [oOptions.sExtension]
 * @param {string} [oOptions.sPath]
 * @param {number} [oOptions.iSaveDays]
 * @param {Boolean} [oOptions.bLogdate]
 * @param {Boolean} [oOptions.bLogtyp]
 * @returns {exports}
 */
module.exports = function (oOptions) {
    _setOptions(oOptions);
    return exports;
};
