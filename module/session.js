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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Setup Options for the session
 * @class
 * @param {Object} oConf
 * @param {Object} oConf.redis
 * @param {boolean} oConf.redis.enabled
 * @param {string} oConf.redis.socket
 * @param {string} oConf.cookie
 */
var Session = function (oConf) {
    this.oConfig = oConf;
    if (this.oConfig.redis.enabled) {
        if (this.oConfig.redis.socket === undefined || this.oConfig.redis.socket === ".") {
            this.redis = new IORedis();
        } else {
            this.redis = new IORedis(this.oConfig.redis.socket);
        }
    }
};

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
Session.prototype.startSession = function (oCookie, oParam) {
    var that = this;
    return new Promise(function (fFulfill) {
        if (oParam.session) {
            var sSessionid = helper.randomString(32, "aA#", {
                "prefix": oParam.prefix,
                "suffix": oParam.suffix
            });
            if (oParam.cookie) {
                oCookie.set(that.oConfig.cookie, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true,
                    "expires": new Date((helper.currentTimestamp() + enums.Year * 20) * 1000)
                });
            } else {
                oCookie.set(that.oConfig.cookie, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true
                });
            }
            if (that.oConfig.redis.enabled) {
                that.redis.set(sSessionid, oParam.redis);
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
Session.prototype.endSession = function (oCookie, oParam) {
    var that = this;
    return new Promise(function (fFulfill) {
        if (oParam.sessionid === undefined) {
            fFulfill();
        } else if (that.oConfig.redis.enabled) {
            that.redis.del(oParam.sessionid, function () {
                oCookie.set(that.oConfig.cookie);
                fFulfill();
            });
        } else {
            oCookie.set(that.oConfig.cookie);
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
Session.prototype.loadSessionData = function (req, res, fLoadData) {
    var that = this;
    var oCookie = new Cookie(req, res);
    var sSessionid = oCookie.get(this.oConfig.cookie);
    req.clientdata = {
        "sessionid": "                                "
    };
    return new Promise(function (fFulfill, fReject) {
            if (sSessionid !== undefined && sSessionid.length > 0) {
                if (that.oConfig.redis.enabled) {
                    that.redis.get(sSessionid, function (oError, result) {
                        if (oError) {
                            fReject({
                                "type": errorcode.ERR_invalidPermission,
                                "SERR": "NoSessionRedisError"
                            });
                        }
                        if (result) {
                            req.clientdata.sessionid = sSessionid;
                            fFulfill(result);
                        }
                        fFulfill();
                    });
                } else {
                    fReject({
                        "type": errorcode.ERR_internal,
                        "SERR": "RedisDisabled"
                    });
                }
            } else {
                fFulfill();
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

exports.Session = Session;
