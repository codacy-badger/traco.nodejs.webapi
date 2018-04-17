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
    this.classname = "user";

    // Database fields
    this.fields = fields || {
        "userID": "         ",
        "sUsername": "",
        "sPassword": "",
        "cPermission": "00000",
        "dtSince": helper.currentTimestamp(),
        "dtLastAccess": undefined,
        "sFirstname": "",
        "sLastname": "",
        "sEmail": "",
        "sPhone": "",
        "dtBirthday": undefined,
        "sAddress": "",
        "sComment": ""
    };

    let that = this;
    // Getter und Setter
    this.get = {
        userID: function () {
            return that.fields.userID;
        },
        sUsername: function () {
            return that.fields.sUsername;
        },
        sPassword: function () {
            return that.fields.sPassword;
        },
        cPermission: function () {
            return that.fields.cPermission;
        },
        dtSince: function () {
            return that.fields.dtSince;
        },
        sFirstname: function () {
            return that.fields.sFirstname;
        },
        sLastname: function () {
            return that.fields.sLastname;
        },
        sEmail: function () {
            return that.fields.sEmail;
        },
        sPhone: function () {
            return that.fields.sPhone;
        },
        dtBirthday: function () {
            return that.fields.dtBirthday;
        },
        sAddress: function () {
            return that.fields.sAddress;
        },
        sComment: function () {
            return that.fields.sComment;
        }
    };

    this.set = {
        userID: function (sID) {
            that.fields.userID = sID;
        },
        sUsername: function (sUsername) {
            that.fields.sUsername = sUsername;
        },
        sPassword: function (sPassword) {
            that.fields.sPassword = sPassword;
        },
        cPermission: function (cPermission) {
            that.fields.cPermission = cPermission;
        },
        dtSince: function (dtSince) {
            that.fields.dtSince = dtSince;
        },
        sFirstname: function (sFirstname) {
            that.fields.sFirstname = sFirstname;
        },
        sLastname: function (sLastname) {
            that.fields.sLastname = sLastname;
        },
        sEmail: function (sEmail) {
            that.fields.sEmail = sEmail;
        },
        sPhone: function (sPhone) {
            that.fields.sPhone = sPhone;
        },
        dtBirthday: function (dtBirthday) {
            that.fields.dtBirthday = dtBirthday;
        },
        sAddress: function (sAddress) {
            that.fields.sAddress = sAddress;
        },
        sComment: function (sComment) {
            that.fields.sComment = sComment;
        }
    };

    // Functions

};
