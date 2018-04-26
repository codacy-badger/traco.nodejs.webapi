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
    this.classname = "note";

    // Database fields
    this.fields = fields || {
        "noteID": "               ",
        "idMember": "        ",
        "dtCreate": helper.currentTimestamp(),
        "sText": ""
    };

    const that = this;
    // Getter und Setter
    this.get = {
        noteID: function () {
            return that.fields.noteID;
        },
        idMember: function () {
            return that.fields.idMember;
        },
        dtCreate: function () {
            return that.fields.dtCreate;
        },
        sText: function () {
            return that.fields.sText;
        }
    };

    this.set = {
        noteID: function (sID) {
            that.fields.noteID = sID;
        },
        idMember: function (sID) {
            that.fields.idMember = sID;
        },
        dtCreate: function (iValue) {
            that.fields.dtCreate = iValue;
        },
        sText: function (sValue) {
            that.fields.sText = sValue;
        }
    };

    // Functions

};
