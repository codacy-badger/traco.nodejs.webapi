"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Modul
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Turns a date into a array of dates with [YYYY, MM, DD, hh, mm, ss] values.
 * @param {Date} oDate
 * @returns {string[]}
 */
exports.split = function (oDate) {
    if (!oDate) {
        oDate = new Date();
    }

    var aSplit = oDate.toISOString().split("T");
    var dateSplit = aSplit[0].split("-");
    var timeSplit = aSplit[1].split(".")[0].split(":");
    var aDate = dateSplit.concat(timeSplit);
    return aDate;
};

/**
 * Returns a date string pre-compiled for a filename: "YYYYMMDD"
 * @param {Date} oDate
 * @returns {string}
 */
exports.logfileDate = function (oDate) {
    if (!oDate) {
        oDate = new Date();
    }

    var sDate = "";
    var aDate = exports.split(oDate);
    sDate += aDate[0];
    sDate += aDate[1];
    sDate += aDate[2];
    return sDate;
};

/**
 * Turns a date into
 * @param {Date} oDate
 * @returns {string}
 */
exports.logDate = function (oDate) {
    if (!oDate) {
        oDate = new Date();
    }

    var sDate = "";
    // Aus ISO-Format lässt sich leich generieren
    var aDate = oDate.toISOString().split("T");
    // YYYY-MM-DD
    sDate += aDate[0];
    sDate += " ";
    aDate = aDate[1].split(".");
    // hh:mm:ss
    sDate += aDate[0];
    return sDate;
};

/**
 * Turns the date in a string with given template
 * @param {Date} oDate
 * @param {string} sTmpl
 * @returns {string}
 */
exports.genDate = function (oDate, sTmpl) {
    if (!oDate) {
        oDate = new Date();
    }

    var _generate = function () {
        var aDate = exports.split(oDate);
        var aSupport = ["YY", "MM", "DD", "hh", "mm", "ss"];
        var i = 0;
        while (i < aSupport.length) {
            if (sTmpl.indexOf(aSupport[i] !== -1)) {
                sTmpl = sTmpl.replace(aSupport[i], aDate[i]);
            }
            i += 1;
        }
        return sTmpl;
    };

    switch (sTmpl) {
        case "unix":
            return Math.floor(oDate.getTime() / 1000);
        case "utc":
            return oDate.toUTCString();
        case "iso":
            return oDate.toISOString();
        default:
            return _generate();
    }
};
