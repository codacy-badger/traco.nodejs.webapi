"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var eArray = require("./array");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Compare two Object and returns true if they are the same.
 * @param {Object} oObj1
 * @param {Object} oObj2
 * @returns {Boolean}
 */
exports.compare = function (oObj1, oObj2) { // eslint-disable-line
    if (!oObj1 || !oObj2) {
        return false;
    }

    var propName;
    for (propName in oObj1) {
        if (oObj1.hasOwnProperty(propName) !== oObj2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof oObj1[propName] !== typeof oObj2[propName]) {
            return false;
        }
    }

    for (propName in oObj2) {
        if (oObj1.hasOwnProperty(propName) !== oObj2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof oObj1[propName] !== typeof oObj2[propName]) {
            return false;
        }

        if (!oObj1.hasOwnProperty(propName)) {
            continue;
        }

        if (oObj1[propName] instanceof Array &&
            oObj2[propName] instanceof Array) {
            /** REQUIRES array.compare **/
            if (!eArray.compare(oObj1[propName], oObj2[propName])) {
                return false;
            }
        } else if (oObj1[propName] instanceof Object &&
            oObj2[propName] instanceof Object) {
            if (exports.compare(oObj1[propName], oObj2[propName])) {
                return false;
            }
        } else if (oObj1[propName] !== oObj2[propName]) {
            return false;
        }
    }
    return true;
};

/**
 * Check the object for some propertys.
 * @param {Object} oObj
 * @returns {Boolean}
 */
exports.isEmpty = function (oObj) {
    if (Object.keys(oObj).length === 0) {
        return true;
    }
    return false;
};

/**
 * Merge the objects into one object
 * @param {Object} oObj1
 * @param {Object} oObj2
 * @returns {Object}
 */
exports.merge = function (oObj1, oObj2) {
    var oObj3 = {};
    Object.keys(oObj1).forEach(function (key) {
        oObj3[key] = oObj1[key];
    });
    Object.keys(oObj2).forEach(function (key) {
        oObj3[key] = oObj2[key];
    });
    return oObj3;
};
