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
    this.classname = "membernote";

    // Database fields
    this.fields = fields || {
        "membernoteID": "               ",
        "idMember": "        ",
        "dtCreate": helper.currentTimestamp(),
        "sText": ""
    };

    const that = this;
    // Getter und Setter
    this.get = {
        membernoteID: function () {
            return that.fields.membernoteID;
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
        membernoteID: function (sID) {
            that.fields.membernoteID = sID;
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

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Membernote.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.membernoteID(),
            "dtCreate": this.get.dtCreate(),
            "text": this.get.sText()
        };
    };

};
