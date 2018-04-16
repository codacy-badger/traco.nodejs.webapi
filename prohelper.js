"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var classes = require("./classes");
var helper = require("./helper");
var dbhandler = require("./dbhandler");
var config = require("./static/config.json");
var enums = require("./static/enums.json");
var errorcode = require("./static/errorcodes.json");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.loadSessionData = function (dataSet) {

    // Die _load Funktion soll Projektspezifische sessionDaten laden.
    var _load = function (data) {
        var oUserdata;
        return dbhandler.fetch(["FetchUserdataID"], [data])
            .then(function (aData) {
                oUserdata = new classes.Userdata(aData[0]);
                if ((oUserdata.get.lastAccess() + enums.Minute) < helper.date("unixTime")) {
                    oUserdata.set.lastAccess();
                    return dbhandler.insertOrUpdate(oUserdata);
                }
                return;
            })
            .then(function () {
                return oUserdata;
            });
    };

    return helper.startPromiseChain()
        .then(function () {
            if (config.redis.enabled) {
                return _load(dataSet);
            } else {
                var aSplitId = dataSet.split("-");
                return _load(aSplitId[0]);
            }
        })
        .then(function (sessionData) {
            return sessionData;
        });
};

exports.loadSessionDataFail = function (errSet) {
    var rtn = {
        "err": errSet
    };
    // Aufbau alle Objektinhalte die in den SessionData an anderer Stelle gebraucht werden.

    rtn = new classes.Userdata();

    // Zurückgeben von genau diesem Object.
    return rtn;
};

exports.httpErrorHandler = function (oResponse, oError) {
    if (!helper.isSet(oError.SERR)) {
        oError = {
            "type": "unknown",
            "error": oError
        };
    }
    switch (oError.type) {
        case (errorcode.ERR_invalidCommand):
            oResponse.statusCode = 404; // Not Found
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case (errorcode.ERR_individualError):
            oResponse.statusCode = 400; // Bad Request
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case (errorcode.ERR_invalidUserPermission):
            oResponse.statusCode = 401; // Unauthorized
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case (errorcode.ERR_checkRequiredValues):
            oResponse.statusCode = 400; // Bad Request
            oResponse.json({
                "SERR": oError.SERR,
                "values": oError.arguments.aMissingValues
            });
            break;
        default:
            console.log(oError); // eslint-disable-line
            oResponse.statusCode = 500; // Internal Server Error
            oResponse.json({
                "SERR": "UnknownError"
            });
    }
};

exports.invalid = function (req, res) {
    exports.httpErrorHandler(res, {
        "type": helper.getErrorcode("ERR_invalidCommand"),
        "error": "WrongAPICommand"
    });
};
