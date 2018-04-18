"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("./prototype/loadPrototype");
var bluebird = require("bluebird");
var config = require("./static/config.json");
var Cookie = require("cookies");
var enums = require("./static/enums.json");
var errorcodes = require("./static/errorcodes.json");
var IORedis = require("ioredis");
var logger = require("./module/simple-file-logger");
var fs = require("fs");
var path = require("path");
var prohelper = require("./prohelper");

var redis;
if (config.redis.enabled) {
    if (config.redis.socket === undefined || config.redis.socket === ".") {
        redis = new IORedis();
    } else {
        redis = new IORedis(config.redis.socket);
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.log = function (sType, osMessage, oOptions) {
    logger.log(sType, osMessage, oOptions);
};

exports.getErrorcode = function (sCode) {
    if (exports.isSet(errorcodes[sCode])) {
        return errorcodes[sCode];
    }
    // Wenn der errocode nicht existiert, wird ein FATAL Error angenommen.
    return 99;
};

exports.getEnums = function (sCode) {
    if (exports.isSet(enums[sCode])) {
        return enums[sCode];
    }
    // Wenn der enum nicht existiert, wird ein TypeError zurückgegeben.
    throw new TypeError(sCode + " is not a ENUM");
};

exports.sqlsafe = function (req, res, next) {

    var _safeObject = function (oArray) {
        var oData = {};
        Object.keys(oArray).forEach(function (key) {
            if (exports.isObject(oArray[key])) {
                oData[key] = _safeObject(oArray[key]);
            } else if (exports.isArray(oArray[key])) {
                oData[key] = [];
                var i = 0;
                while (i < oArray[key].length) {
                    if (exports.isObject(oArray[key][i]) || exports.isArray(oArray[key][i])) {
                        oData[key].push(_safeObject(oArray[key][i]));
                    } else {
                        oData[key].push(exports.htmlspecialchars(oArray[key][i]));
                    }
                    i += 1;
                }
            } else {
                oData[key] = exports.htmlspecialchars(oArray[key]);
            }
        });
        return oData;
    };

    try {
        if (req.method === "GET") {
            req.body = req.query;
        }
        req.body = _safeObject(req.body);
        return next();
    } catch (oErr) {
        console.log(oErr); // eslint-disable-line
        prohelper.httpErrorHandler(res, {
            "type": exports.getErrorcode("ERR_individualError"),
            "SERR": "FailedRequestValidation"
        });
    }
};

exports.startSession = function (oCookie, oParam) {
    try {
        if (oParam.session) {
            var sSessionid = exports.randomString(32, "aA#", {
                "prefix": oParam.prefix,
                "suffix": oParam.suffix
            });
            if (oParam.cookie === true || oParam.cookie === "true") {
                oCookie.set(config.cookie.session, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true,
                    "expires": new Date(Date.now() + enums.Year * 10 * 1000)
                });
            } else {
                oCookie.set(config.cookie.session, sSessionid, {
                    "overwrite": true,
                    "httpOnly": true
                });
            }
            if (config.redis.enabled) {
                redis.set(sSessionid, oParam.redis);
            }
        }
    } catch (err) {
        console.log(err); // eslint-disable-line
    }
};

exports.endSession = function (oCookie, oParam) {
    if (oParam.sessionid !== undefined) {
        if (config.redis.enabled) {
            redis.del(oParam.sessionid);
            oCookie.set(config.cookie.session);
        } else {
            oCookie.set(config.cookie.session);
        }
    }
};

exports.loadSessionData = function (req, res, next) {
    var oCookie = new Cookie(req, res);
    var sSessionid = oCookie.get(config.cookie.session);
    req.clientdata = {
        "sessionid": "                                ",
        "sessiondata": {}
    };

    exports.startPromiseChain()
        .then(function () {
            if (config.redis.enabled) {
                return new Promise(function (fFulfill, fReject) {
                    redis.get(sSessionid, function (error, result) {
                        var err;
                        if (!error) {
                            if (result) {
                                fFulfill(prohelper.loadSessionData(result));
                            } else {
                                err = {
                                    "ERR": "No Redis fetch result",
                                    "sSessionid": sSessionid
                                };
                                fReject(prohelper.loadSessionDataFail(err));
                            }
                        } else {
                            err = {
                                "ERR": "Redis fetch failed",
                                "err": error,
                                "sSessionid": sSessionid
                            };
                            fReject(prohelper.loadSessionDataFail(err));
                        }
                    });
                });
            } else if (sSessionid !== undefined) {
                return prohelper.loadSessionData(sSessionid);
            }
            var err = {
                "ERR": "Keine Session am laufen!"
            };
            throw prohelper.loadSessionDataFail(err);
        })
        .then(function (sessionData) {
            req.clientdata = {
                "sessionid": sSessionid,
                "sessiondata": sessionData
            };
            req.oSessionData = sessionData;
            next();
        })
        .catch(function (err) {
            req.oSessionData = err;
            next();
        });
};

exports.currentTimestamp = function () {
    return Math.floor(Date.now() / 1000);
};

exports.randomString = function (iLength, sChars, oOptions) {
    var sMask = "";
    var sResult = "";
    var iMaskLength = 0;
    if (oOptions === undefined) {
        oOptions = {};
    }
    if (sChars.indexOf("a") > -1) {
        sMask += "abcdefghijklmnopqrstuvwxyz";
    }
    if (sChars.indexOf("A") > -1) {
        sMask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (sChars.indexOf("#") > -1) {
        sMask += "0123456789";
    }
    if (sChars.indexOf("!") > -1) {
        sMask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    }
    iMaskLength = sMask.length - 1;
    if (oOptions.prefix !== undefined) {
        sResult = oOptions.prefix;
        iLength -= oOptions.prefix.length;
    }
    if (oOptions.suffix !== undefined) {
        iLength -= oOptions.suffix.length;
    }
    while (iLength > 0) {
        sResult += sMask[Math.round(Math.random() * iMaskLength)];
        iLength -= 1;
    }
    if (oOptions.suffix !== undefined) {
        sResult += oOptions.suffix;
    }
    return sResult;
};

exports.randomInt = function (iFrom, iTo) {
    return Math.round(Math.random() * (iTo - iFrom) + iFrom);
};

exports.hasChar = function (sString, sChars) {
    var iChar = sChars.length;
    if (sChars.indexOf("a") > -1) {
        if (sString.match(/[abcdefghijklmnopqrstuvwxyz]/)) {
            iChar = iChar - 1;
        }
    }
    if (sChars.indexOf("A") > -1) {
        if (sString.match(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/)) {
            iChar = iChar - 1;
        }
    }
    if (sChars.indexOf("#") > -1) {
        if (sString.match(/[1234567890]/)) {
            iChar = iChar - 1;
        }
    }
    if (sChars.indexOf("!") > -1) {
        if (sString.match(/[~`!@#$%^&*()_+-={}[\]:";'<>?,./|\\]/)) {
            iChar = iChar - 1;
        }
    }
    if (iChar === 0) {
        return true;
    }
    return false;
};

exports.isset = function (oItem) {
    return oItem !== undefined && oItem !== null;
};

exports.isTrue = function (oValue, bAsInteger) {
    var bIsTrue = oValue === "true" || oValue === "1" || oValue === true || oValue === 1;
    if (bAsInteger) {
        if (bIsTrue) {
            return 1;
        }
        return 0;
    }
    return bIsTrue;
};

exports.xor = function (conditionA, conditionB) {
    return (conditionA || conditionB) && !(conditionA && conditionB);
};

exports.checkRequiredValues = function (aValues) {
    return new Promise(function (fFulfill, fReject) {
        var n = 0;
        var aMissingValues = [];
        while (n < aValues.length) {
            if (aValues[n][1] === undefined || Object.keys(aValues[n][1]).length <= 0) {
                aMissingValues.push(aValues[n][0]);
            }
            n += 1;
        }
        if (aMissingValues.length === 0) {
            fFulfill();
        } else {
            fReject({
                "type": exports.getErrorcode("ERR_checkRequiredValues"),
                "SERR": "MissingRequiredValues",
                "arguments": {
                    "aMissingValues": aMissingValues
                }
            });
        }
    });
};

exports.startPromiseChain = function () {
    return new Promise(function (fFulfill) {
        fFulfill();
    });
};

exports.promiseWhile = bluebird.method(function (condition, action) {
    if (!condition()) {
        return;
    }
    return action().then(exports.promiseWhile.bind(null, condition, action));
});

exports.validateEmail = function (sEmail) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(sEmail);
};

exports.isArray = function (test) {
    return test instanceof Array;
};

exports.isObject = function (test) {
    return typeof test === "object" && !exports.isArray(test);
};

exports.isInt = function (test) {
    return typeof test === "number";
};

exports.isString = function (test) {
    return typeof test === "string";
};

exports.isFunc = function (test) {
    return typeof test === "function";
};

exports.isBool = function (test) {
    return typeof test === "boolean";
};

exports.htmlspecialchars = function (sString) {
    if (!exports.isString(sString)) {
        sString = String(sString);
    }
    var map = {
        "!": "&#033;",
        "\"": "&#034;",
        "$": "&#036;",
        "&": "&#038;",
        "'": "&#039;",
        "<": "&#060;",
        ">": "&#062;",
        "\\": "&#92;",
        "/": "&#47;",
        "	": "&nbsp;&nbsp;" // eslint-disable-line
    };
    return sString.replace(/[!"$&'<>\\/\t]/g, function (m) {
        return map[m];
    });
};

exports.filewalker = function (dir, done) {
    let results = [];

    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var pending = list.length;

        if (!pending) {
            return done(null, results);
        }

        list.forEach(function (file) {
            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    results.push(file);

                    exports.filewalker(file, function (errr, res) {
                        results = results.concat(res);
                        if (!(pending -= 1)) {
                            done(null, results);
                        }
                    });
                } else {
                    results.push(file);

                    if (!(pending -= 1)) {
                        done(null, results);
                    }
                }
            });
        });
    });
};

exports.firstLetterUpperCase = function (sString) {
    return sString[0].toUpperCase() + sString.substr(1);
};
