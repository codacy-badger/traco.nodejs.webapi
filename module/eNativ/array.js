"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var eObject = require("./object");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Compare two Array and returns true if they are the same.
 * @param {any[]} aArr1
 * @param {any[]} aArr2
 * @returns {Boolean}
 */
exports.compare = function (aArr1, aArr2) {
    if (!aArr1 || !aArr2) {
        return false;
    }

    if (aArr1.length !== aArr2.length) {
        return false;
    }

    var n = 0;
    while (n < aArr1.length) {
        if (aArr1[n] instanceof Array &&
            aArr2[n] instanceof Array) {
            if (!exports.compare(aArr1[n], aArr2[n])) {
                return false;
            }
        } else if (aArr1[n] instanceof Object &&
            aArr2[n] instanceof Object) {
            /** REQUIRES Object.compare **/
            if (!eObject.compare(aArr1[n], aArr2[n])) {
                return false;
            }
        } else if (aArr1[n] !== aArr2[n]) {
            return false;
        }
        n += 1;
    }
    return true;
};

/**
 * Reorder the array with objects like an SQL-OrderBy Statement. If propname starts with `-` the order is DESC.
 * @param {Object[]} aArr
 * @param {string[]} aProps
 * @returns {Object[]}
 */
exports.sortBy = function (aArr, aProps) {

    var _sortByAttr = function (attr) {
        var sortOrder = 1;
        if (attr[0] === "-") {
            sortOrder = -1;
            attr = attr.substring(1);
        }

        return function (a, b) {
            var result = 0;
            if (a[attr] < b[attr]) {
                result = -1;
            }
            if (a[attr] > b[attr]) {
                result = 1;
            }
            return result * sortOrder;
        };
    };

    var _getSortFunc = function (props) {
        if (props.length === 0) {
            throw new TypeError("Array.sortBy() MUST have at least 1 argument");
        }

        return function (a, b) {
            var result = 0;
            var i = 0;
            while (result === 0 && i < props.length) {
                result = _sortByAttr(props[i])(a, b);
                i += 1;
            }
            return result;
        };
    };

    return aArr.sort(_getSortFunc(aProps));
};

/**
 * Check if the array is emty and returns true if empty.
 * @param {any[]} aArr
 * @returns {Boolean}
 */
exports.isEmpty = function (aArr) {
    if (aArr.length === 0) {
        return true;
    }
    return false;
};

/**
 * Creates the same array trimmed down to unique values.
 * @param {any[]} aArr
 * @returns {any[]}
 */
exports.unique = function (aArr) {
    var unq = [];
    var i = 0;
    while (i < aArr.length) {
        if (!unq.includes(aArr[i])) {
            unq.push(aArr[i]);
        }
        i += 1;
    }
    return unq;
};

/**
 * Removes a spezific position in the array.
 * @param {any[]} aArr
 * @param {number} iPos
 * @returns {any[]}
 */
exports.removePos = function (aArr, iPos) {
    return aArr.splice(iPos, 1);
};

/**
 * Removes a spezific string-value completely from the array.
 * @param {string[]} aArr
 * @param {string[]} sStr
 * @returns {string[]}
 */
exports.removeStr = function (aArr, sStr) {
    while (aArr.includes(sStr)) {
        aArr.removePos(aArr.indexOf(sStr));
    }
    return aArr;
};

/**
 * Searchs every index of the searched value.
 * @param {any[]} aArr
 * @param {any[]} search
 * @returns {number[]}
 */
exports.allIndexOf = function (aArr, search) {
    var idx = [];
    var i = -1;
    while (aArr.indexOf(search, i + 1) !== -1) {
        i = aArr.indexOf(search, i + 1);
        idx.push(i);
    }
    return idx;
};
