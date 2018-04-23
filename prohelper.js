"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// var classes = require("./classes");
var config = require("./static/config.json");
var helper = require("./helper");
// var dbhandler = require("./dbhandler")(config.mysql, require("./static/dbcursor.json"));
// var enums = helper.getEnums();
var errorcode = helper.getErrorcodes();
var logger = require("./module/logger");
var Logger = new logger.Logger({
    bConsole: config.debug,
    sFilename: "prohelper",
    iSaveDays: config.logger.iSaveDays
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports.httpErrorHandler = function (oResponse, oError) {
    const HttpStatusCodes = {
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        Conflict: 409,
        Gone: 410,
        Locked: 423,
        InternalServerError: 500,
        ServiceUnavailable: 503
    };
    if (!helper.isset(oError.SERR)) {
        oError = {
            "type": "unknown",
            "error": oError
        };
    }
    switch (oError.type) {
        case errorcode.ERR_invalidCommand:
            oResponse.statusCode = HttpStatusCodes.NotFound;
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case errorcode.ERR_individualError:
            oResponse.statusCode = HttpStatusCodes.BadRequest;
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case errorcode.ERR_invalidUserPermission:
            oResponse.statusCode = HttpStatusCodes.Unauthorized;
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        case errorcode.ERR_checkRequiredValues:
            oResponse.statusCode = HttpStatusCodes.BadRequest;
            oResponse.json({
                "SERR": oError.SERR,
                "values": oError.arguments.aMissingValues
            });
            break;
        case errorcode.ERR_internal:
        default:
            Logger.log(helper.convertJSONToString(oError), 3);
            oResponse.statusCode = 500; // Internal Server Error
            oResponse.json({
                "SERR": "UnknownError"
            });
    }
};

exports.invalid = function (req, res) {
    exports.httpErrorHandler(res, {
        "type": errorcode.ERR_invalidCommand,
        "error": "WrongAPICommand"
    });
};
