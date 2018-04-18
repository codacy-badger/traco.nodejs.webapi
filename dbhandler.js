"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var mysql = require("mysql");
var helper = require("./helper");
var config = require("./static/config.json");
var dbcurser = require("./static/dbcurser.json");
var connection;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var handleDisconnect = function () {
    // Create connection pool
    connection = mysql.createPool(config.mysql.main);

    // If you are also serving http, display a 503 error.
    connection.on("error", function (err) {
        // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            console.log(err); // eslint-disable-line
            throw err;
        }
    });
};

if (config.mysql.enabled) {
    handleDisconnect();
}

var fileLog = function (sType, sSQL) {
    if (sType === undefined) {
        sType = "UNDEFINED";
    }
    helper.log(sType, sSQL, {
        "bFile": config.debug.logSQL,
        "bConsole": false,
        "sFilename": "logSQL"
    });
};

var _errorHandler = function (err, sType) {
    if (!err) {
        err = {};
    }
    console.log(err); // eslint-disable-line
    var oErr = {};
    switch (err.code) {
        case "ER_DUP_ENTRY":
            oErr = {
                "SERR": "DB_DUP"
            };
            break;
        default:
            oErr = {
                "SERR": "DB_QEURY_" + sType
            };
    }
    fileLog("ERROR", "---------- ONE Statement above was an ERROR ----------");
    return oErr;
};

var _escape = function (sData) {
    if (helper.isString(sData)) {
        sData = sData.replace(new RegExp("@", "g"), "\x40");
    }
    return connection.escape(sData);
};

var _doQuery = function (sSQL, sType) {
    sSQL = sSQL.replace(/\x40/g, "@");
    fileLog(sType, sSQL);
    return new Promise(function (fFulfill, fReject) {
        if (config.mysql.enabled) {
            connection.query(sSQL, function (err, data) {
                if (err) {
                    fReject(_errorHandler(err, sType));
                } else {
                    fFulfill(data);
                }
            });
        } else {
            fReject({
                "SERR": "DB_DISABLED"
            });
        }
    });
};

var _generateKey = function (oDBClass, oOptions) {
    oOptions = oOptions || {};
    oOptions.prefix = oOptions.prefix || "";
    oOptions.suffix = oOptions.suffix || "";
    oOptions.chars = oOptions.chars || "#A";

    var sKey = Object.keys(oDBClass.fields)[0];
    if (helper.isInt(oDBClass.fields[sKey]) ||
        oDBClass.fields[sKey].trim().length !== 0) {
        /**
         * Wenn Key schon vorhanden ist weitergehen
         * Wenn Key eine Zahl ist key = AUTO_INCREMENT
         */
        return helper.startPromiseChain()
            .then(function () {
                return oDBClass;
            });
    }
    var iIDLength = oDBClass.fields[sKey].length;
    var sRandomID = helper.randomString(iIDLength, oOptions.chars, {
        "prefix": oOptions.prefix,
        "suffix": oOptions.suffix
    });
    var sSQL = "SELECT * FROM `" + oDBClass.classname + "` WHERE '" + sKey + "' = @0 LIMIT 1;";
    return helper.promiseWhile(function () {
        return oDBClass.fields[sKey].trim().length === 0;
    }, function () {
        return exports.fetch(sSQL, [sRandomID])
            .then(function (data) {
                if (data.length === 0) {
                    oDBClass.fields[sKey] = sRandomID;
                } else {
                    sRandomID = helper.randomString(iIDLength, oOptions.chars, {
                        "prefix": oOptions.prefix,
                        "suffix": oOptions.suffix
                    });
                }
            })
            .then(function () {
                return oDBClass;
            });
    });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DB-Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.fetch = function (sCurser, aData) {
    var sSQL = sCurser;
    // Wenn nur ein Pointer auf einen Curser gemeint ist dieses Auswählen
    if (helper.isset(dbcurser[sCurser])) {
        sSQL = dbcurser[sCurser];
    }
    var iData = 0;
    if (helper.isset(aData)) {
        iData = aData.length;
    }
    var n = 0;
    while (n < iData) {
        if (helper.isArray(aData[n])) {
            let sData = "";
            let i = 0;
            while (i < aData[n].length) {
                sData += _escape(aData[n][i]) + ", ";
                i += 1;
            }
            aData[n] = sData.substring(0, sData.length - 2);
        }
        // Globales ersetzen der Parameter (Fals ein Parameter mehrfach vorkommt)
        sSQL = sSQL.replace(new RegExp("@" + n, "g"), _escape(aData[n]));
        n += 1;
    }
    return _doQuery(sSQL, "fetch");
};

exports.insert = function (oDBClass, oOptions) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var _generateInsert = function () {
        var aDBFields = Object.keys(oDBClass.fields);
        var sSQL = "INSERT INTO`" + oDBClass.classname + "` (";
        var n = 0;
        while (n < aDBFields.length) {
            sSQL += "`" + aDBFields[n] + "`, ";
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2);
        sSQL += ") VALUES (";
        var aDBValues = Object.values(oDBClass.fields);
        n = 0;
        while (n < aDBFields.length) {
            if (helper.isset(aDBValues[n])) {
                sSQL += "" + _escape(aDBValues[n]) + ", ";
            } else {
                sSQL += "NULL, ";
            }
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2);
        sSQL += ");";
        return _doQuery(sSQL, "insert");
    };

    return _generateKey(oDBClass, oOptions)
        .then(function () {
            return _generateInsert();
        });
};

exports.insertOrUpdate = function (oDBClass, oOptions) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var _generateInsert = function () {
        var aDBFields = Object.keys(oDBClass.fields);
        var sSQL = "INSERT INTO `" + oDBClass.classname + "` (";
        var n = 0;
        while (n < aDBFields.length) {
            sSQL += "`" + aDBFields[n] + "`, ";
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2);
        sSQL += ") VALUES (";
        var aDBValues = Object.values(oDBClass.fields);
        n = 0;
        while (n < aDBFields.length) {
            if (helper.isset(aDBValues[n])) {
                sSQL += _escape(aDBValues[n]) + ", ";
            } else {
                sSQL += "NULL, ";
            }
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2);
        sSQL += ") ON DUPLICATE KEY UPDATE ";
        n = 0;
        while (n < aDBFields.length) {
            if (helper.isset(aDBValues[n])) {
                sSQL += "`" + aDBFields[n] + "` = " + _escape(aDBValues[n]) + ", ";
            } else {
                sSQL += "`" + aDBFields[n] + "` = NULL, ";
            }
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2) + ";";
        return _doQuery(sSQL, "insertOrUpdate");
    };

    return _generateKey(oDBClass, oOptions)
        .then(function () {
            return _generateInsert();
        });
};

exports.delete = function (oDBClass) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var sSQL = "DELETE FROM `" + oDBClass.classname + "` WHERE ";
    sSQL += "`" + Object.keys(oDBClass.fields)[0] + "` = " + _escape(Object.values(oDBClass.fields)[0]) + ";";
    return _doQuery(sSQL, "delete");
};

exports.getCurser = function (sCurser) {
    if (dbcurser[sCurser]) {
        return dbcurser[sCurser];
    }
    throw new TypeError("DBCurser '" + sCurser + "' doesn't exists");
};
