"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var fs = require("fs-extra");
var path = require("path");
var colors = require("colors");
var exDate = require("./exNativ/date");
var bluebird = require("bluebird");
var CronJob = require("cron").CronJob;

var enums = {
    "Secound": 1,
    "Minute": 60,
    "Hour": 3600,
    "Day": 86400,
    "Week": 6048000,
    "Year": 31557600
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var promiseWhile = bluebird.method(function (condition, action) {
    if (!condition()) {
        return;
    }
    return action().then(promiseWhile.bind(null, condition, action));
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Create a Logger with default or alternativ Options.
 * @class
 * @param {Object} [oOptions]
 * @param {boolean} [oOptions.bConsole]
 * @param {string} [oOptions.sColor]
 * @param {boolean} [oOptions.bFile]
 * @param {boolean} [oOptions.bFiledate]
 * @param {boolean} [oOptions.sFilemode] to enable hourly/minutely files: ["day", "hour", "min"]
 * @param {string} [oOptions.sFilename]
 * @param {string} [oOptions.sExtension]
 * @param {string} [oOptions.sPath] Depend from root
 * @param {number} [oOptions.iSaveDays]
 * @param {boolean} [oOptions.bLogdate]
 * @param {boolean} [oOptions.bLogtyp]
 * @param {boolean} [oOptions.bAutodel] To disable the deletion cronjob
 */
var Logger = function (oOptions) { // eslint-disable-line
    /** @default */
    this.oConfig = {
        bConsole: true,
        sColor: ".",

        bFile: true,
        bFiledate: true,
        sFilemode: "day",
        sFilename: "log",
        sExtension: "log",
        sPath: path.join(__dirname, "..", ".tmp"),
        iSaveDays: 14,
        bLogdate: true,
        bLogtyp: true,
        bAutodel: true
    };
    /** @default */
    this.fCron = undefined;

    /* eslint-disable curly */
    if (!oOptions) oOptions = {};
    if (!oOptions.bConsole && oOptions.bConsole !== undefined) this.oConfig.bConsole = false;
    if (oOptions.sColor) this.oConfig.sColor = oOptions.sColor;

    if (!oOptions.bFile && oOptions.bFile !== undefined) this.oConfig.bFile = false;
    if (!oOptions.bFiledate && oOptions.bFiledate !== undefined) this.oConfig.bFiledate = false;
    if (oOptions.sFilename) this.oConfig.sFilename = oOptions.sFilename;
    if (oOptions.sFilemode) this.oConfig.sFilemode = oOptions.sFilemode;
    if (oOptions.sExtension) this.oConfig.sExtension = oOptions.sExtension;
    if (oOptions.sPath) this.oConfig.sPath = path.join(__dirname, "..", oOptions.sPath);
    if (oOptions.iSaveDays) {
        if (oOptions.iSaveDays * enums.Day < enums.Minute) {
            this.oConfig.iSaveDays = (1 + 0.000000000000001) / 24 / 60;
        } else {
            this.oConfig.iSaveDays = oOptions.iSaveDays;
        }
    }
    if (!oOptions.bLogdate && oOptions.bLogdate !== undefined) this.oConfig.bLogdate = false;
    if (!oOptions.bLogtyp && oOptions.bLogtyp !== undefined) this.oConfig.bLogtyp = false;
    if (!oOptions.bAutodel && oOptions.bAutodel !== undefined) this.oConfig.bAutodel = false;
    /* eslint-enable curly */
    this.setupCron();
};

/**
 * Logging a spezific Message in log-File.
 * @param {string} sMessage
 * @param {string|number} sType Pre defined numeric Values are ["DEBUG", "INFO", "WARN", "ERROR"] with number 0-3
 * @returns {void}
 */
Logger.prototype.log = function (sMessage, sType) {
    var that = this;

    var _setMessage = function () {
        var sMess = "";
        if (that.oConfig.bLogdate) {
            sMess += "[" + exDate.logDate() + "] ";
        }
        if (that.oConfig.bLogtyp) {
            sMess += " [ " + sType + " ]  ";
        }
        sMessage = sMess + sMessage;
        sMessage = sMessage.replace(/(?:\r\n|\r|\n)/g, "	"); // eslint-disable-line
    };

    var _logConsole = function () {
        /* eslint-disable no-console */
        var sHead = " ---- " + sType + " ---- ";
        if (colors[that.oConfig.sColor]) {
            console.log(colors[that.oConfig.sColor](sHead));
        } else {
            console.log(colors.magenta(sHead));
        }
        console.log(colors.grey(exDate.logDate()));
        console.log(sMessage);
        /* eslint-enable no-console */
    };

    var _logFile = function () {
        // that.delOldFiles();
        var sFile = "";

        sFile += that.oConfig.sFilename;
        if (that.oConfig.iSaveDays * enums.Day < enums.Minute) {
            that.oConfig.iSaveDays = enums.Minute;
        }
        if (that.oConfig.bFiledate) {
            sFile += "_" + exDate.logFileDate();
            if (that.oConfig.iSaveDays * enums.Day >= enums.Day && that.oConfig.sFilemode === "day") {
                // Default braucht nicht mehr
            } else if (that.oConfig.iSaveDays * enums.Day >= enums.Hour && that.oConfig.sFilemode !== "min" || that.oConfig.sFilemode === "hour") {
                sFile += "-" + exDate.genDate("hh");
            } else {
                sFile += "-" + exDate.genDate("hhmm");
            }
        }
        sFile += "." + that.oConfig.sExtension;
        fs.ensureDir(that.oConfig.sPath)
            .then(function () {
                return fs.appendFile(path.join(that.oConfig.sPath, sFile), sMessage + "\n");
            })
            .then(function () {
                // console.log("The " + sFile + ".log file was saved!");
            })
            .catch(function (err) {
                console.log("logger ERROR in write file: " + err.code); // eslint-disable-line
            });
    };

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
    if (that.oConfig.bConsole) {
        _logConsole();
    }
    _setMessage();
    if (that.oConfig.bFile) {
        _logFile();
    }
};

/**
 * Deletes all files wich are older than the iSaveDays Time.
 * @returns {void}
 */
Logger.prototype.delOldFiles = function () {
    var that = this;
    var i = 0;
    console.log("Start LOG-deletion for filename '" + that.oConfig.sFilename + "'..."); // eslint-disable-line
    fs.readdir(that.oConfig.sPath)
        .then(function (aFiles) {
            return promiseWhile(function () {
                return i < aFiles.length;
            }, function () {
                if (aFiles[i].indexOf(that.oConfig.sFilename) !== -1) {
                    return fs.stat(path.join(that.oConfig.sPath, aFiles[i]))
                        .then(function (oStats) {
                            if (oStats.mtimeMs + enums.Day * that.oConfig.iSaveDays * 1000 <= Date.now()) {
                                console.log(" -- deleting file: " + path.join(that.oConfig.sPath, aFiles[i])); // eslint-disable-line
                                return fs.unlink(path.join(that.oConfig.sPath, aFiles[i]));
                            }
                        })
                        .then(function () {
                            i += 1;
                        });
                }
                return new Promise(function (fFulfill) {
                    i += 1;
                    fFulfill();
                });
            });
        })
        .then(function () {
            return;
        })
        .catch(function (err) {
            console.log("logger ERROR in delete file: " + err.code); // eslint-disable-line
        });
};

/**
 * Creates the cronjob for the spezific Logger and the iSaveTime. For spezific time there are spezific Cronjobs.
 * @param {string} [sPattern] "\* \* \* \* \* \*" is pattern for "SEC MIN HOUR DAY MONTH YEAR" and can have values like [0-59, 0-59, 0-24, 0-6, 0-11, DATE]
 * @returns {void}
 */
Logger.prototype.setupCron = function (sPattern) {
    if (!this.oConfig.bAutodel) {
        return;
    }
    var that = this;
    if (that.fCron !== undefined) {
        that.fCron.stop();
    }
    if (sPattern) {
        that.fCron = new CronJob(sPattern, function () {
            that.delOldFiles();
        }, null, true);
    }
    if (that.oConfig.iSaveDays * enums.Day >= enums.Day) {
        that.fCron = new CronJob("0 0 0 * * *", function () {
            that.delOldFiles();
        }, null, true);
    } else if (that.oConfig.iSaveDays * enums.Day >= enums.Hour) {
        that.fCron = new CronJob("0 0 * * * *", function () {
            that.delOldFiles();
        }, null, true);
    } else {
        that.fCron = new CronJob("0 * * * * *", function () {
            that.delOldFiles();
        }, null, true);
    }
};

exports.Logger = Logger;
