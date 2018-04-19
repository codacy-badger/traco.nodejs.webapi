"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var object = require("./object");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Compare two Array and returns true if they are the same.
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @returns {Boolean}
 */
exports.compare = function (arr1, arr2) {
    if (!arr1 || !arr2) {
        return false;
    }

    if (arr1.length !== arr2.length) {
        return false;
    }

    var n = 0;
    while (n < arr1.length) {
        if (arr1[n] instanceof Array &&
            arr2[n] instanceof Array) {
            if (!exports.compare(arr1[n], arr2[n])) {
                return false;
            }
        } else if (arr1[n] instanceof Object &&
            arr2[n] instanceof Object) {
            /** REQUIRES Object.compare **/
            if (!object.compare(arr1[n], arr2[n])) {
                return false;
            }
        } else if (arr1[n] !== arr2[n]) {
            return false;
        }
        n += 1;
    }
    return true;
};

/**
 * Reorder the array with objects like an SQL-OrderBy Statement. If propname starts with `-` the order is DESC.
 * @param {Object[]} arr
 * @param {string[]} aProps
 * @returns {Object[]}
 */
exports.sortBy = function (arr, aProps) {

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

    return arr.sort(_getSortFunc(aProps));
};

/**
 * Check if the array is emty and returns true if empty.
 * @param {any[]} arr
 * @returns {Boolean}
 */
exports.isEmpty = function (arr) {
    if (arr.length === 0) {
        return true;
    }
    return false;
};

/**
 * Creates the same array trimmed down to unique values.
 * @param {any[]} arr
 * @returns {any[]}
 */
exports.unique = function (arr) {
    var unq = [];
    var i = 0;
    while (i < arr.length) {
        if (!unq.includes(arr[i])) {
            unq.push(arr[i]);
        }

        i += 1;
    }
    return unq;
};

exports.unique2 = function (arr) {
    var unq = [];
    return arr.filter(function (oIten) {
        if (unq.includes(oIten)) {
            return false;
        }
        unq.push(oIten);
        return true;
    });
};
