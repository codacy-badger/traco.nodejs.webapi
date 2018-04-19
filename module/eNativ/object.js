"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var array = require("./array");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Compare two Object and returns true if they are the same.
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Boolean}
 */
exports.compare = function (obj1, obj2) { // eslint-disable-line
    if (!obj1 || !obj2) {
        return false;
    }

    var propName;
    for (propName in obj1) {
        if (obj1.hasOwnProperty(propName) !== obj2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof obj1[propName] !== typeof obj2[propName]) {
            return false;
        }
    }

    for (propName in obj2) {
        if (obj1.hasOwnProperty(propName) !== obj2.hasOwnProperty(propName)) {
            return false;
        } else if (typeof obj1[propName] !== typeof obj2[propName]) {
            return false;
        }

        if (!obj1.hasOwnProperty(propName)) {
            continue;
        }

        if (obj1[propName] instanceof Array &&
            obj2[propName] instanceof Array) {
            /** REQUIRES array.compare **/
            if (!array.compare(obj1[propName], obj2[propName])) {
                return false;
            }
        } else if (obj1[propName] instanceof Object &&
            obj2[propName] instanceof Object) {
            if (exports.compare(obj1[propName], obj2[propName])) {
                return false;
            }
        } else if (obj1[propName] !== obj2[propName]) {
            return false;
        }
    }
    return true;
};

/**
 * Check the object for some propertys.
 * @param {Object} obj
 * @returns {Boolean}
 */
exports.isEmpty = function (obj) {
    if (Object.keys(obj).length === 0) {
        return true;
    }
    return false;
};
