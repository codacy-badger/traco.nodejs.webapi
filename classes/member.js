"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");
var dbhandler = require("../dbhandler")(require("../static/config.json").mysql, require("../static/dbcursor.json"));

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "member";

    // Database fields
    this.fields = fields || {
        "memberID": "        ",
        "idContact": "         ",
        "idGroup": "    ",
        "sUsername": "",
        "sPassword": "",
        "cPermission": "0",
        "dtSince": helper.currentTimestamp(),
        "dtAccess": undefined,
        "sEmail": "",
        "sFirstname": "",
        "sLastname": ""
    };

    const that = this;
    // Getter und Setter
    this.get = {
        memberID: function () {
            return that.fields.memberID;
        },
        idContact: function () {
            return that.fields.idContact;
        },
        idGroup: function () {
            return that.fields.idGroup;
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
        dtAccess: function () {
            return that.fields.dtAccess;
        },
        sEmail: function () {
            return that.fields.sEmail;
        },
        sFirstname: function () {
            return that.fields.sFirstname;
        },
        sLastname: function () {
            return that.fields.sLastname;
        }
    };

    this.set = {
        memberID: function (sID) {
            that.fields.memberID = sID;
        },
        idContact: function (sID) {
            that.fields.idContact = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        sUsername: function (sValue) {
            that.fields.sUsername = sValue;
        },
        sPassword: function (sValue) {
            that.fields.sPassword = sValue;
        },
        cPermission: function (sValue) {
            that.fields.cPermission = sValue;
        },
        dtSince: function (iValue) {
            that.fields.dtSince = iValue;
        },
        dtAccess: function (iValue) {
            that.fields.dtAccess = iValue;
        },
        sEmail: function (sValue) {
            that.fields.sEmail = sValue;
        },
        sFirstname: function (sValue) {
            that.fields.sFirstname = sValue;
        },
        sLastname: function (sValue) {
            that.fields.sLastname = sValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.memberID(),
            "idContact": this.get.idContact(),
            "idGroup": this.get.idGroup(),
            "username": this.get.sUsername(),
            "permission": this.get.cPermission(),
            "since": this.get.dtSince(),
            "access": this.get.dtAccess(),
            "email": this.get.sEmail(),
            "firstname": this.get.sFirstname(),
            "lastname": this.get.sLastname()
        };
    };

    /**
     * Updates the current users dtAccess value in the Database.
     * @returns {Promise}
     */
    this.updateAccess = function () {
        this.set.dtAccess(helper.currentTimestamp());
        return dbhandler.insertOrUpdate(this);
    };
};
