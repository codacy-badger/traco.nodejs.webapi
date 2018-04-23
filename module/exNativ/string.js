"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Look for every position of a searched string in a string
 * @param {string} sString
 * @param {string} search
 * @returns {number[]}
 */
exports.allIndexOf = function (sString, sSearch) {
    var idx = [];
    var i = -1;
    while (sString.indexOf(sSearch, i + 1) !== -1) {
        i = sString.indexOf(sSearch, i + 1);
        idx.push(i);
    }
    return idx;
};
