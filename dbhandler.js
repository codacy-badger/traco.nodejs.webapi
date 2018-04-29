"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var mysql = require("mysql");
var helper = require("./helper");
var exNativ = require("./module/exNativ");
var errorcode = helper.getErrorcodes();
var logger = require("./module/logger");
var dbLogger;
var config;
var connection;
var dbcursor;

var handleDisconnect = function () {
    // Create connection pool
    connection = mysql.createPool(config.conn);

    // If you are also serving http, display a 503 error.
    connection.on("error", function (err) {
        // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            dbLogger.log("CAN'T CONNECT TO DATABASE!!", 3);
            console.log(err); // eslint-disable-line
            throw err;
        }
    });
};

/**
 * Setup for the dbhandler individual for every require
 * @module
 * @param {Object} oConfig
 * @param {boolean} oConfig.enabled MUST be true
 * @param {Object} oConfig.conn
 * @param {number} oConfig.conn.connectionLimit
 * @param {string} oConfig.conn.host
 * @param {string} oConfig.conn.user
 * @param {string} oConfig.conn.password
 * @param {string} oConfig.conn.database
 * @param {string} oConfig.conn.charset
 * @param {boolean} oConfig.debug
 * @param {Object} oCursor
 */
module.exports = function (oConfig, oCursor) {
    config = oConfig;
    dbcursor = oCursor;
    dbLogger = new logger.Logger({
        bConsole: config.debug.console,
        sFilename: "logSQL",
        iSaveDays: config.debug.iSaveDays
    });

    if (config.enabled) {
        handleDisconnect();
    }

    return exports;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var fileLog = function (sType, sSQL) {
    if (sType === undefined) {
        sType = "UNDEFINED";
    }
    if (config.debug.enabled) {
        dbLogger.log(sType + " >-< " + sSQL, 0);
    }
};

var _errorHandler = function (err, sType) {
    if (!err) {
        err = {};
    }
    console.log(err); // eslint-disable-line
    var oErr = {
        "type": errorcode.ERR_sqlerror,
        "SERR": ""
    };
    switch (err.code) {
        case "ER_DUP_ENTRY":
            oErr.SERR = "DB_DUP";
            break;
        default:
            oErr.SERR = "DB_QEURY_" + sType;
    }
    dbLogger.log(helper.convertJSONToString({
        "Code": err.code,
        "Query": err.sql,
        "fatal": err.fatal
    }), 3);
    return oErr;
};

var _doQuery = function (sSQL, sType) {
    fileLog(sType, sSQL);
    return new Promise(function (fFulfill, fReject) {
        if (config.enabled) {
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
    oOptions.chars = oOptions.chars || "aA#";

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
    var sSQL = "SELECT * FROM `" + oDBClass.classname + "` WHERE `" + sKey + "` = @0 LIMIT 1;";
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

var _buildSQLCurserObject = function (sCursor, aParams) {
    var i = 0;
    var x = 0;
    var aIndices = [];
    var aObjectParams = [];
    var oCursor = {
        "query": sCursor,
        "params": []
    };
    // Find and sort all parameters for the cursor
    while (i < aParams.length) {
        aIndices = exNativ.Array.allIndexOf(oCursor.query, "@" + i);
        x = 0;
        while (x < aIndices.length) {
            aObjectParams.push({
                "index": aIndices[x],
                "value": aParams[i]
            });
            x += 1;
        }
        i += 1;
    }
    aObjectParams.sort(function (a, b) {
        return a.index - b.index;
    });
    i = 0;
    while (i < aObjectParams.length) {
        oCursor.params.push(aObjectParams[i].value);
        i += 1;
    }
    // Replace all old spaceholders with a questionmark
    i = 0;
    while (i < aParams.length) {
        oCursor.query = oCursor.query.replace(new RegExp("@" + i, "g"), "?");
        i += 1;
    }
    return oCursor;
};

var _buildInsert = function (oDBClass) {
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
        sSQL += connection.escape(aDBValues[n]) + ", ";
        n += 1;
    }
    sSQL = sSQL.substring(0, sSQL.length - 2);
    sSQL += ")";
    return sSQL;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DB-Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Perorme a Database Fetch with given cursor-Statement and inserted data.
 * @param {string} sCursor
 * @param {string[]} [aData]
 * @param {Object} [oOptions]
 * @param {Object[]} [oOptions.orderby]
 * @param {string} oOptions.orderby.col Table collumn
 * @param {string} oOptions.orderby.order ASC | DESC
 * @param {number} [oOptions.limit]
 * @param {number} [oOptions.offset]
 * @return {Promise}
 */
exports.fetch = function (sCursor, aData, oOptions) { // eslint-disable-line
    if (!oOptions) {
        oOptions = {};
    }
    if (!oOptions.orderby) {
        // Order Bys müssen per array eingefügt werden mit
        // [["spaltenname", "ASC"], ["spaltenname2", "DESC"]]
        oOptions.orderby = [];
    }
    if (!oOptions.limit) {
        oOptions.limit = 0;
    }
    if (oOptions.limit > 1000) {
        oOptions.limit = 1000;
    }
    if (!oOptions.offset) {
        oOptions.offset = 0;
    }
    var sSQL = sCursor;
    // Wenn nur ein Pointer auf einen Curser gemeint ist dieses Auswählen
    if (helper.isset(dbcursor[sCursor])) {
        sSQL = dbcursor[sCursor];
    }
    var iData = 0;
    if (helper.isset(aData)) {
        iData = aData.length;
    }
    var n = 0;
    while (n < iData) {
        // Wenn Parameter ein Array ist, muss an der stelle ein IN () angenommen werden
        if (helper.isArray(aData[n])) {
            var sAt = "";
            let i = 0;
            while (i < aData[n].length) {
                sAt += "@" + n + ",";
                i += 1;
            }
            sAt = sAt.substring(0, sAt.length - 1);
            // Globales ersetzen (Fals ein Parameter mehrfach vorkommt) der Parameter durch mehrfach Parameterinsert
            sSQL = sSQL.replace(new RegExp("@" + n, "g"), sAt);
        }
        n += 1;
    }
    if (oOptions.orderby.length > 0) {
        sSQL += " ORDER BY";
        n = 0;
        while (n < oOptions.orderby.length) {
            sSQL += " `" + oOptions.orderby[n].col + "` " + oOptions.orderby[n].order + ",";
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 1);
    }
    if (oOptions.limit > 0) {
        sSQL += " LIMIT " + oOptions.limit;
    }
    if (oOptions.offset > 0) {
        sSQL += " OFFSET " + oOptions.offset;
    }

    var oCursor = _buildSQLCurserObject(sSQL, aData);
    fileLog("fetch", oCursor.query);
    return new Promise(function (fFulfill, fReject) {
        if (config.enabled) {
            connection.query(oCursor.query, oCursor.params, function (err, data) {
                if (err) {
                    fReject(_errorHandler(err, "fetch"));
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

/**
 * Performe a INSERT-Statement with the given DBClass-
 * @param {Object} oDBClass DBClass
 * @param {Object} [oOptions] Options for keygen
 * @param {string} [oOptions.prefix]
 * @param {string} [oOptions.suffix]
 * @param {string} [oOptions.chars] 'aA#!'
 * @returns {Promise}
 */
exports.insert = function (oDBClass, oOptions) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var _generateInsert = function () {
        var sSQL = _buildInsert(oDBClass);
        return _doQuery(sSQL, "insert");
    };

    return _generateKey(oDBClass, oOptions)
        .then(function () {
            return _generateInsert();
        });
};

/**
 * Performe a INSERT-Statement with the given DBClass or UPDATE a dataset in the database.
 * @param {Object} oDBClass DBClass
 * @param {Object} [oOptions] Options for keygen
 * @param {string} [oOptions.prefix]
 * @param {string} [oOptions.suffix]
 * @param {string} [oOptions.chars] 'aA#!'
 * @returns {Promise}
 */
exports.insertOrUpdate = function (oDBClass, oOptions) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var _generateInsert = function () {
        var sSQL = _buildInsert(oDBClass);
        var aDBFields = Object.keys(oDBClass.fields);
        var aDBValues = Object.values(oDBClass.fields);
        sSQL += " ON DUPLICATE KEY UPDATE ";
        var n = 0;
        while (n < aDBFields.length) {
            sSQL += "`" + aDBFields[n] + "` = " + connection.escape(aDBValues[n]) + ", ";
            n += 1;
        }
        sSQL = sSQL.substring(0, sSQL.length - 2);
        return _doQuery(sSQL, "insertOrUpdate");
    };

    return _generateKey(oDBClass, oOptions)
        .then(function () {
            return _generateInsert();
        });
};

/**
 * Performe a DELETE-Statement to the Database with the given DBClass
 * @param {Object} oDBClass
 * @returns {Promise}
 */
exports.delete = function (oDBClass) {
    if (!helper.isset(oDBClass) || !helper.isset(oDBClass.fields)) {
        throw new TypeError("No oDBClass given for insert");
    }

    var sSQL = "DELETE FROM `" + oDBClass.classname + "` WHERE ";
    sSQL += "`" + Object.keys(oDBClass.fields)[0] + "` = " + connection.escape(Object.values(oDBClass.fields)[0]);
    return _doQuery(sSQL, "delete");
};
