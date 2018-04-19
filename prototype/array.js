"use strict";
/**
 * @class
 */
//************************************************
// neue Prototypes
//************************************************
if (Array.prototype.sortBy) console.warn("Override existing Array.prototype.sortBy!"); // eslint-disable-line
Array.prototype.sortBy = function () {

    var _sortByAttr = function (attr) {
        var sortOrder = 1;
        if (attr[0] === "-") {
            sortOrder = -1;
            attr = attr.substr(1);
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

    var _getSortFunc = function () {
        if (arguments.length === 0) {
            throw new TypeError("Array.sortBy() MUST have at least 1 argument");
        }

        var args = arguments;
        if (args[0] instanceof Array) {
            args = args[0];
        }

        return function (a, b) {
            var result = 0;
            var i = 0;
            while (result === 0 && i < args.length) {
                result = _sortByAttr(args[i])(a, b);
                i += 1;
            }
            return result;
        };
    };

    return this.sort(_getSortFunc.apply(null, arguments));
};

if (Array.prototype.compare) console.warn("Override existing Array.prototype.compare!"); // eslint-disable-line
Array.prototype.compare = function (array) {
    if (!array) {
        return false;
    }

    if (this.length !== array.length) {
        return false;
    }

    var n = 0;
    while (n < this.length) {
        if (this[n] instanceof Array && array[n] instanceof Array) {
            if (!this[n].compare(array[n])) {
                return false;
            }
        } else if (this[n] instanceof Object && array[n] instanceof Object) {
            /** REQUIRES Object.compare **/
            if (!this[n].compare(array[n])) {
                return false;
            }
        } else if (this[n] !== array[n]) {
            return false;
        }
        n += 1;
    }
    return true;
};

if (Array.prototype.isEmpty) console.warn("Override existing Array.prototype.isEmpty!"); // eslint-disable-line
Array.prototype.isEmpty = function () {
    if (this.length === 0) {
        return true;
    }
    return false;
};

if (Array.prototype.unique) console.warn("Override existing Array.prototype.unique!"); // eslint-disable-line
/**
 * Creates a array with every entry just one time.
 * @returns {string[]}
 */
Array.prototype.unique = function () {
    var arr = [];
    var i = 0;
    while (i < this.length) {
        if (!arr.includes(this[i])) {
            arr.push(this[i]);
        }
        i += 1;
    }
    return arr;
};

if (Array.prototype.removePos) console.warn("Override existing Array.prototype.removePos!"); // eslint-disable-line
/**
 * Removes a spezific position in the array.
 * @param {number} iPos
 * @returns {void}
 */
Array.prototype.removePos = function (iPos) {
    if (!iPos) {
        throw new TypeError("No Position given");
    }
    if (iPos === -1) {
        throw new TypeError("Position isn't a position");
    }

    this.splice(iPos, 1);
};

if (Array.prototype.removeStr) console.warn("Override existing Array.prototype.removeStr!"); // eslint-disable-line
/**
 * Removes a spezific string complete from the array.
 * @param {string} sStr
 * @returns {void}
 */
Array.prototype.removeStr = function (sStr) {
    if (!sStr) {
        throw new TypeError("No String given");
    }

    while (this.includes(sStr)) {
        this.removePos(this.indexOf(sStr));
    }
};

if (Array.prototype.indexOfAll) console.warn("Override existing Array.prototype.indexOfAll!"); // eslint-disable-line
/**
 * Creates a array out of the Positions of the searched string.
 * @param {string} search
 * @returns {number[]}
 */
Array.prototype.indexOfAll = function (search) {
    var idx = [];
    var i = -1;
    while (this.indexOf(search, i + 1) !== -1) {
        i = this.indexOf(search, i + 1);
        idx.push(i);
    }
    return idx;
};
