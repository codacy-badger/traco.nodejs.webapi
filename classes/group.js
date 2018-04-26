"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "group";

    // Database fields
    this.fields = fields || {
        "groupID": "    ",
        "sName": "",
        "dtSince": helper.currentTimestamp(),
        "iTasks": 0
    };

    const that = this;
    // Getter und Setter
    this.get = {
        groupID: function () {
            return that.fields.groupID;
        },
        sName: function () {
            return that.fields.sName;
        },
        dtSince: function () {
            return that.fields.dtSince;
        },
        iTasks: function () {
            return that.fields.iTasks;
        }
    };

    this.set = {
        groupID: function (sID) {
            that.fields.groupID = sID;
        },
        sName: function (sValue) {
            that.fields.sName = sValue;
        },
        dtSince: function (iValue) {
            that.fields.dtSince = iValue;
        },
        iTasks: function (iValue) {
            that.fields.iTasks = iValue;
        }
    };

    // Functions

};
