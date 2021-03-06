"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var bluebird = require("bluebird");
var config = require("./static/config.json");
var enums = require("./static/enums");
var errorcode = require("./static/errorcodes.json");
var fs = require("fs-extra");
var path = require("path");
var exNativ = require("./module/exNativ");
var Logger = require("./module/logger").Logger;
var logger = new Logger({
    bConsole: config.logger.bConsole,
    sFilename: "logMain",
    iSaveDays: config.logger.iSaveDays
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Logging a spezific Message in log-File named "logMain_*DATE*.log".
 * @param {string} sMessage
 * @param {string|number} sType Pre defined numeric Values are ["DEBUG", "INFO", "WARN", "ERROR"] with number 0-3
 * @returns {void}
 */
exports.log = function (sMessage, sType) {
    logger.log(sMessage, sType);
};

/**
 * Returns all enums from `static/enums.json` and add the oAdditionalEnums.
 * @param {Object} oAdditionalEnums
 * @returns {Object}
 */
exports.getEnums = function (oAdditionalEnums) {
    oAdditionalEnums = oAdditionalEnums || {};
    enums.additional = oAdditionalEnums;
    return enums;
};

/**
 * Returns all errorcodes from `static/errorcodes.json` and add the oAdditionalError.
 * @param {Object} oAdditionalError
 * @returns {Object}
 */
exports.getErrorcodes = function (oAdditionalError) {
    oAdditionalError = oAdditionalError || {};
    return exNativ.Object.merge(errorcode, oAdditionalError);
};

/**
 * Turns the data in req.body into SQL-Safe data without htmlspezialchars.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {void}
 */
exports.sqlsafe = function (req, res, next) {

    var _safeObject = function (oArray) { // eslint-disable-line
        var oData;
        if (exports.isArray(oArray)) {
            oData = [];
            for (let n = 0; n < oArray.length; n += 1) {
                if (exports.isObject(oArray[n])) {
                    oData.push(_safeObject(oArray[n]));
                } else if (exports.isArray(oArray[n])) {
                    oData.push([]);
                    for (let i = 0; i < oArray[n].length; i += 1) {
                        if (exports.isObject(oArray[n][i]) || exports.isArray(oArray[n][i])) {
                            oData[n].push(_safeObject(oArray[n][i]));
                        } else {
                            oData[n].push(exports.htmlspecialchars(oArray[n][i]));
                        }
                    }
                } else {
                    oData.push(exports.htmlspecialchars(oArray[n]));
                }
            }
        } else {
            oData = {};
            var aKeys = Object.keys(oArray);
            for (let n = 0; n < aKeys.length; n += 1) {
                if (exports.isObject(oArray[aKeys[n]])) {
                    oData[aKeys[n]] = _safeObject(oArray[aKeys[n]]);
                } else if (exports.isArray(oArray[aKeys[n]])) {
                    oData[aKeys[n]] = [];
                    for (let i = 0; i < oArray[aKeys[n]].length; i += 1) {
                        if (exports.isObject(oArray[aKeys[n]][i]) || exports.isArray(oArray[aKeys[n]][i])) {
                            oData[aKeys[n]].push(_safeObject(oArray[aKeys[n]][i]));
                        } else {
                            oData[aKeys[n]].push(exports.htmlspecialchars(oArray[aKeys[n]][i]));
                        }
                    }
                } else {
                    oData[aKeys[n]] = exports.htmlspecialchars(oArray[aKeys[n]]);
                }
            }
        }
        return oData;
    };

    try {
        req.body = _safeObject(req.body);
        return next();
    } catch (oErr) {
        exports.log({
            "message": "Error in request validation!",
            "error": oErr
        }, 3);
        res.statusCode = 400;
        res.json({
            "SERR": "FailedRequestValidation"
        });
    }
};

/**
 * Generate the current unix-timestamp
 * @returns {number}
 */
exports.currentTimestamp = function () {
    return Math.floor(Date.now() / 1000);
};

/**
 * Generates a random string with given parameters
 * @param {number} iLength
 * @param {string} sChars 'aA#!'
 * @param {Object} [oOptions]
 * @param {string} [oOptions.prefix]
 * @param {string} [oOptions.suffix]
 * @returns {string}
 */
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

/**
 * Generates a random Number.
 * @param {number} iFrom
 * @param {number} iTo
 * @returns {number}
 */
exports.randomInt = function (iFrom, iTo) {
    return Math.round(Math.random() * (iTo - iFrom) + iFrom);
};

/**
 * Check if the string includes the searched char.
 * @param {string} sString
 * @param {string} sChars 'aA#!'
 * @returns {boolean}
 */
exports.hasChar = function (sString, sChars) {
    var iChar = sChars.length;
    if (sChars.indexOf("a") > -1) {
        if (sString.match(/[abcdefghijklmnopqrstuvwxyz]/)) {
            iChar -= 1;
        }
    }
    if (sChars.indexOf("A") > -1) {
        if (sString.match(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/)) {
            iChar -= 1;
        }
    }
    if (sChars.indexOf("#") > -1) {
        if (sString.match(/[1234567890]/)) {
            iChar -= 1;
        }
    }
    if (sChars.indexOf("!") > -1) {
        if (sString.match(/[~`!@#$%^&*()_+-={}[\]:";'<>?,./|\\]/)) {
            iChar -= 1;
        }
    }
    if (iChar === 0) {
        return true;
    }
    return false;
};

/**
 * Check the item to undefined and null.
 * @param {any} oItem
 * @returns {boolean}
 */
exports.isset = function (oItem) {
    return oItem !== undefined && oItem !== null;
};

/**
 * Check the value to string number and boolean true values.
 * @param {any} oValue
 * @param {boolean} bAsInteger
 * @returns {boolean|number}
 */
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

/**
 * Performes a XOR Operation to some conditions.
 * @param {condition} conditionA
 * @param {condition} conditionB
 * @returns {boolean}
 */
exports.xor = function (conditionA, conditionB) {
    return (conditionA || conditionB) && !(conditionA && conditionB);
};

/**
 * Check the given Values to be set.
 * @param {Array[]} aValues
 * @param {any} aValues.0 Valuename
 * @param {any} aValues.1 Value to check
 * @returns {Promise}
 */
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
                "type": errorcode.ERR_checkRequiredValues,
                "SERR": "MissingRequiredValues",
                "arguments": {
                    "aMissingValues": aMissingValues
                }
            });
        }
    });
};

/**
 * Starts a Promise chain.
 * @returns {Promise}
 */
exports.startPromiseChain = function () {
    return new Promise(function (fFulfill) {
        fFulfill();
    });
};

/**
 * Starts a while-loop with Promises.
 * @method
 * @returns {Promise}
 * @example
 * return helper.promiseWhile(function () {
 *      return i < n;
 * }, function () {
 *      return new Promise (function (fFulfill, fReject) {
 *          try {
 *              i += 1;
 *              fFulfill();
 *          } catch (err) {
 *              fReject(err);
 *          }
 *      });
 * });
 */
exports.promiseWhile = bluebird.method(function (condition, action) {
    if (!condition()) {
        return;
    }
    return action().then(exports.promiseWhile.bind(null, condition, action));
});

/**
 * Try to confirm a validate email-address.
 * @param {string} sEmail
 * @returns {boolean}
 */
exports.validateEmail = function (sEmail) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(sEmail);
};

/**
 * Test to be a instanceof Array.
 * @param {any|Array} oItem
 * @returns {boolean}
 */
exports.isArray = function (oItem) {
    return oItem instanceof Array;
};

/**
 * Test to be a instanceof Object.
 * @param {any|Object} oItem
 * @returns {boolean}
 */
exports.isObject = function (oItem) {
    return oItem instanceof Object;
};

/**
 * test to be typeof "number".
 * @param {any|number} oItem
 * @returns {boolean}
 */
exports.isInt = function (oItem) {
    return typeof oItem === "number";
};

/**
 * Test to be typeof "string".
 * @param {any|string} oItem
 * @returns {boolean}
 */
exports.isString = function (oItem) {
    return typeof oItem === "string";
};

/**
 * Test to be typeof "function".
 * @param {any|function} oItem
 * @returns {boolean}
 */
exports.isFunc = function (oItem) {
    return typeof oItem === "function";
};

/**
 * Test to be typeof "boolean".
 * @param {any|boolean} oItem
 * @returns {boolean}
 */
exports.isBool = function (oItem) {
    return typeof oItem === "boolean";
};

/**
 * Convert a string into a string without htmlspecialchars.
 * @param {string} sString
 * @returns {string}
 */
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

/**
 * Walk into every directory to every file in the given directory.
 * @param {string} dir
 * @param {callback} done
 * @returns {void}
 */
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
                if (err) {
                    done(err, null);
                }
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    results.push(file);

                    exports.filewalker(file, function (oErr, res) {
                        if (oErr) {
                            done(oErr, null);
                        }
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

/**
 * Turns the first letter of the string to uppercase.
 * @param {string} sString
 * @returns {string}
 */
exports.firstLetterUpperCase = function (sString) {
    return sString[0].toUpperCase() + sString.substr(1);
};

/**
 * Turns a string from convertJSONToString() back into JSON.
 * @param {string} sJSON
 * @param {Object} oDefault
 * @returns {Object}
 */
exports.convertStringToJSON = function (sJSON, oDefault) {
    try {
        if (sJSON !== undefined && sJSON.length > 0) {
            sJSON = sJSON.replace(/(?:\r\n|\r|\n)/g, "");
            oDefault = JSON.parse(sJSON);
        }
    } catch (e) {
        console.error(e);
    }
    return oDefault;
};

/**
 * Turns a JSON into a string.
 * @param {Object} oObject
 * @returns {string}
 */
exports.convertJSONToString = function (oObject) {
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
    } catch (e) {
        console.error(e);
    }
    return sJSON;
};

/**
 * Returns a NEW object with same data as the inserted Object.
 * @param {Object} oObject
 * @returns {Object}
 * @see module:module/exNativ/object.clone
 */
exports.clone = function (oObject) {
    return exNativ.Object.clone(oObject);
};

/**
 * Searchs every index of the searched value.
 * @param {string[]} aArray
 * @param {string} sSearch
 * @returns {number[]}
 * @see module:module/exNativ/array.allIndexOf
 */
exports.arrayIndexOfAll = function (aArray, sSearch) {
    return exNativ.Array.allIndexOf(aArray, sSearch);
};
