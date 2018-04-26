"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "tasktype";

    // Database fields
    this.fields = fields || {
        "tasktypeID": "       ",
        "idGroup": "    ",
        "sName": "",
        "bIntern": 0
    };

    const that = this;
    // Getter und Setter
    this.get = {
        tasktypeID: function () {
            return that.fields.tasktypeID;
        },
        idGroup: function () {
            return that.fields.idGroup;
        },
        sName: function () {
            return that.fields.sName;
        },
        bIntern: function () {
            return that.fields.bIntern;
        }
    };

    this.set = {
        tasktypeID: function (sID) {
            that.fields.tasktypeID = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        sName: function (sValue) {
            that.fields.sName = sValue;
        },
        bIntern: function (iValue) {
            that.fields.bIntern = iValue;
        }
    };

    // Functions

};