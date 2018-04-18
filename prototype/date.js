"use strict";
//************************************************
// neue Prototypes
//************************************************
if (Date.prototype.logfileDate) console.warn("Override existing Date.prototype.logfileDate!"); // eslint-disable-line
Date.prototype.logfileDate = function () {

    var sDate = "";
    sDate += this.getFullYear();
    if (this.getMonth() + 1 < 10) {
        sDate += "0" + (this.getMonth() + 1);
    } else {
        sDate += this.getMonth() + 1;
    }
    if (this.getDate() < 10) {
        sDate += "0" + this.getDate();
    } else {
        sDate += this.getDate();
    }
    return sDate;
};

if (Date.prototype.logDate) console.warn("Override existing Date.prototype.logDate!"); // eslint-disable-line
Date.prototype.logDate = function () {

    var sDate = "";
    // Aus ISO-Format lässt sich leich generieren
    var aDate = this.toISOString().split("T");
    // YYYY-MM-DD
    sDate += aDate[0];
    sDate += " ";
    aDate = aDate[1].split(".");
    // hh:mm:ss
    sDate += aDate[0];
    return sDate;
};

if (Date.prototype.split) console.warn("Override existing Date.prototype.split!"); // eslint-disable-line
Date.prototype.split = function () {

    var aSplit = this.toISOString().split("T");
    var dateSplit = aSplit[0].split("-");
    var timeSplit = aSplit[1].split(".")[0].split(":");
    var aDate = dateSplit.concat(timeSplit);
    return aDate;
};

if (Date.prototype.take) console.warn("Override existing Date.prototype.take!"); // eslint-disable-line
Date.prototype.take = function (sType) {
    var that = this;

    var _generate = function (sPick) {
        var aDate = that.split();
        var aSupport = ["YY", "MM", "DD", "hh", "mm", "ss"];
        var i = 0;
        while (i < aSupport.length) {
            if (sPick.indexOf(aSupport[i] !== -1)) {
                sPick = sPick.replace(aSupport[i], aDate[i]);
            }
            i += 1;
        }
        return sPick;
    };

    switch (sType) {
        case "unix":
            return Math.floor(this.getTime() / 1000);
        case "utc":
            return this.toUTCString();
        case "iso":
            return this.toISOString();
        default:
            return _generate(sType);
    }
};
