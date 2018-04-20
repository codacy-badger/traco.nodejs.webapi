"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("../prototype/loadPrototype");
var fs = require("fs-extra");
var path = require("path");
var colors = require("colors");

var oConfig = {};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var setOptions = function (oOptions) {
    var sDirPath = oOptions.sPath || ".tmp";
    oConfig = {
        "bConsole": true,
        "bFile": true,
        "bLogDate": true,
        "sFilename": oOptions.sFilename || "default",
        "sExtansion": oOptions.sExtansion || "log",
        "sPath": path.join(__dirname, "/../", sDirPath),
        "sSeparator": oOptions.sSeparator || "]-----[",
        "bDatelog": true,
        "sColor": oOptions.sColor || "default",
        "iSaveDays": oOptions.iSaveDays || 7
    };
    if (!oOptions.bConsole && oOptions.bConsole !== undefined) {
        oConfig.bConsole = false;
    }
    if (!oOptions.bFile && oOptions.bFile !== undefined) {
        oConfig.bFile = false;
    }
    if (!oOptions.bLogDate && oOptions.bLogDate !== undefined) {
        oConfig.bLogDate = false;
    }
    if (!oOptions.bDatelog && oOptions.bDatelog !== undefined) {
        oConfig.bDatelog = false;
    }
    // console.log(oConfig)
};

var _setFile = function (sType, oMessage) {
    if (oConfig.sFilename === "default") {
        switch (sType) {
            case "info":
                oConfig.sFilename = "logInfo";
                break;
            case "warn":
                oConfig.sFilename = "logWarn";
                break;
            case "error":
                oConfig.sFilename = "logError";
                break;
            default:
                oConfig.sFilename = "log";
        }
    }

    // Ältere Datein löschen.
    // oldFiles();
    var sMessage = "";
    if (oMessage.date !== "") {
        sMessage += oMessage.date + " " + oConfig.sSeparator + " ";
    }
    if (oMessage.type !== "") {
        sMessage += oMessage.type + " " + oConfig.sSeparator + " ";
    }
    if (oMessage.message !== "") {
        sMessage += oMessage.message;
    }
    sMessage = sMessage.replace(/\r\n/g, "	"); // eslint-disable-line
    sMessage = sMessage.replace(/\n/g, "	"); // eslint-disable-line
    var sDate = "";
    if (oConfig.bDatelog) {
        sDate += "_";
        sDate += new Date().logfileDate();
    }
    fs.appendFile(path.join(oConfig.sPath, oConfig.sFilename + sDate + "." + oConfig.sExtansion), sMessage + "\n", function (err) {
        if (err) {
            console.log("simple-file-logger ERROR in write file: " + err); // eslint-disable-line
        } else {
            // console.log("The " + sFile + ".log file was saved!");
        }
    });
};

var logging = function (sType, oMessage) {
    if (oConfig.bConsole) {
        if (oConfig.sColor === "default") {
            switch (sType) {
                case "info":
                    if (oMessage.type !== "") {
                        console.log(colors.green("----- " + oMessage.type + " -----")); // eslint-disable-line
                    }
                    break;
                case "warn":
                    if (oMessage.type !== "") {
                        console.log(colors.yellow("----- " + oMessage.type + " -----")); // eslint-disable-line
                    }
                    break;
                case "error":
                    if (oMessage.type !== "") {
                        console.log(colors.red("----- " + oMessage.type + " -----")); // eslint-disable-line
                    }
                    break;
                default:
                    if (oMessage.type !== "") {
                        console.log("----- " + oMessage.type + " -----"); // eslint-disable-line
                    }
            }
        } else {
            console.log(("----- " + oMessage.type + " -----")[oConfig.sColor]); // eslint-disable-line
        }
        if (oMessage.date !== "") {
            console.log(oMessage.date.grey); // eslint-disable-line
        }
        console.log(oMessage.oMessage); // eslint-disable-line
    }
    if (oConfig.bFile) {
        _setFile(sType, oMessage);
    }
};

var convertJSONToString = function (oObject) {
    var sJSON = "";
    try {
        if (typeof oObject === "object") {
            sJSON = JSON.stringify(oObject);
            var map = {
                "'": "&#039;"
            };
            sJSON = sJSON.replace(/[']/g, function (m) {
                return map[m];
            });
        }
        if (typeof oObject === "string") {
            sJSON = oObject;
        }
    } catch (e) {
        /*eslint-disable*/
        console.log("-----");
        console.log(e);
        console.log("-----");
        console.log("convertJSONToString");
        console.log("-----");
        console.log(sJSON);
        console.log("-----");
        console.log(oObject);
        console.log("-----");
        /*eslint-enable*/
    }
    return sJSON;
};

exports.log = function (sType, osMessage, oOptions) {
    var oMessage = {
        "date": "",
        "type": "",
        "message": convertJSONToString(osMessage),
        "oMessage": osMessage
    };

    if (sType === undefined || sType === "") {
        sType = "default";
    }

    if (oOptions === undefined) {
        oOptions = {};
    }
    setOptions(oOptions);

    switch (sType) {
        case "info":
            oMessage.type = "info";
            break;
        case "warn":
            oMessage.type = "warn";
            break;
        case "error":
            oMessage.type = "error";
            break;
        default:
            if (sType === "default") {
                oMessage.type = "other";
            } else {
                oMessage.type = sType;
            }

    }
    if (oConfig.bLogDate) {
        oMessage.date = new Date().logDate();
    }
    logging(sType, oMessage);
};
