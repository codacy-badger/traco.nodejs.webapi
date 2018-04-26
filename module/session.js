"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");
var enums = helper.getEnums();
var errorcode = helper.getErrorcodes();
var IORedis = require("ioredis");
var Cookie = require("cookies");
var oConfig;
var redis;

/**
 * Setup Options for the session
 * @param {Object} oConf
 * @param {Object} oConf.redis
 * @param {boolean} oConf.redis.enabled
 * @param {string} oConf.redis.socket
 * @param {string} oConf.cookie
 */
module.exports = function (oConf) {
    oConfig = oConf;
    if (oConf.redis.enabled) {
        if (oConfig.redis.socket === undefined || oConfig.redis.socket === ".") {
            redis = new IORedis();
        } else {
            redis = new IORedis(oConfig.redis.socket);
        }
    }
    return exports;
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Start a new session and set a cookie in the browser.
 * @param {Object} oCookie
 * @param {Object} oParam
 * @param {string} oParam.session MUST BE TRUE FOR COOKIE OR REDIS
 * @param {string} oParam.prefix
 * @param {string} oParam.suffix
 * @param {boolean} oParam.cookie
 * @param {string} oParam.redis
 * @returns {Promise}
 */
exports.startSession = function (oCookie, oParam) {
    return new Promise(function (fFulfill) {
        if (oParam.session) {
            var sSessionid = helper.randomString(32, "aA#", {
                "prefix": oParam.prefix,
                "suffix": oParam.suffix
            });
            if (oParam.cookie) {
                oCookie.set(oConfig.cookie, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true,
                    "expires": new Date((helper.currentTimestamp() + enums.Year * 5) * 1000)
                });
            } else {
                oCookie.set(oConfig.cookie, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true
                });
            }
            if (oConfig.redis.enabled) {
                redis.set(sSessionid, oParam.redis);
            }
        }
        fFulfill();
    });
};

/**
 * Delte the session started with startSession()
 * @param {Object} oCookie
 * @param {Object} oParam
 * @param {string} oParam.sessionid
 * @returns {Promise}
 */
exports.endSession = function (oCookie, oParam) {
    return new Promise(function (fFulfill) {
        if (oParam.sessionid === undefined) {
            fFulfill();
        } else if (oConfig.redis.enabled) {
            redis.del(oParam.sessionid, function () {
                oCookie.set(oConfig.cookie);
                fFulfill();
            });
        } else {
            oCookie.set(oConfig.cookie);
            fFulfill();
        }
    });
};

/**
 * Loading the Sessiondata into req.oSessiondata
 * @param {Object} req
 * @param {Object} res
 * @param {function} fLoadData Can be Promise. Response -> req.oSessiondata
 * @returns {Promise}
 */
exports.loadSessionData = function (req, res, fLoadData) {
    var oCookie = new Cookie(req, res);
    var sSessionid = oCookie.get(oConfig.cookie);
    req.clientdata = {
        "sessionid": "                                "
    };
    return new Promise(function (fFulfill, fReject) {
            if (sSessionid !== undefined && sSessionid.length > 0) {
                if (oConfig.redis.enabled) {
                    redis.get(sSessionid, function (oError, result) {
                        if (oError) {
                            fReject({
                                "type": errorcode.ERR_invalidUserPermission,
                                "SERR": "NoSessionRedisError"
                            });
                        }
                        if (result) {
                            req.clientdata.session = sSessionid;
                            fFulfill(result);
                        }
                    });
                } else {
                    fReject({
                        "type": errorcode.ERR_internal,
                        "SERR": "RedisDisabled"
                    });
                }
            }
        })
        .then(function (result) {
            return fLoadData(result);
        })
        .then(function (oResponse) {
            req.oSessiondata = oResponse;
            return;
        });
};
