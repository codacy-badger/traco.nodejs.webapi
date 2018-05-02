"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var classes = require("./classes");
// var config = require("./static/config.json");
var helper = require("./helper");
// var enums = helper.getEnums();
var errorcode = helper.getErrorcodes();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Response handling for error inside the server like wrong request or internal error.
 * @param {Object} oResponse the browser response Object
 * @param {Object} oError
 * @param {Object} [oError.type] intern code for spezial http response codes
 * @param {Object} [oError.SERR] Code for browser
 * @returns {void}
 */
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
        console.log(oError); // eslint-disable-line
    }
    helper.log(helper.convertJSONToString(oError), 3);
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
        case errorcode.ERR_invalidPermission:
            oResponse.statusCode = HttpStatusCodes.Forbidden;
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
        case errorcode.ERR_sqlerror:
            oResponse.statusCode = 500; // Internal Server Error
            oResponse.json({
                "SERR": oError.SERR
            });
            break;
        default:
            oResponse.statusCode = 500; // Internal Server Error
            oResponse.json({
                "SERR": "UnknownError"
            });
    }
};

/**
 * Response for invalid requests
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
exports.invalid = function (req, res) {
    exports.httpErrorHandler(res, {
        "type": errorcode.ERR_invalidCommand,
        "SERR": "WrongAPICommand"
    });
};

/**
 * Loading the member for Session
 * @param {string} sID
 * @returns {Member}
 */
exports.loadMemberSessionData = function (sID) {
    var oMember = new classes.Member();
    return __dbhandler.fetch("FetchMemberID", [sID])
        .then(function (aData) {
            if (aData.length === 0) {
                throw "No Member";
            }
            oMember = new classes.Member(aData[0]);
            return oMember.updateAccess();
        })
        .then(function () {
            return oMember;
        })
        .catch(function () {
            throw {
                "type": errorcode.ERR_invalidPermission,
                "SERR": "NoCurrentMember"
            };
        });
};

/**
 * Loading the contact for Session
 * @param {string} sID
 * @returns {Member}
 */
exports.loadContactSessionData = function (sID) {
    var oContact = new classes.Contact();
    return __dbhandler.fetch("FetchContactID", [sID])
        .then(function (aData) {
            if (aData.length === 0) {
                throw "No Member";
            }
            oContact = new classes.Contact(aData[0]);
            return oContact.updateAccess();
        })
        .then(function () {
            return oContact;
        })
        .catch(function () {
            throw {
                "type": errorcode.ERR_invalidPermission,
                "SERR": "NoCurrentContact"
            };
        });
};
