"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");
var enums = helper.getEnums();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "contact";

    // Database fields
    this.fields = fields || {
        "contactID": "         ",
        "idGroup": "    ",
        "sUsername": "",
        "sPassword": "",
        "dtSince": helper.currentTimestamp(),
        "dtAccess": undefined,
        "sEmail": "",
        "sFirstname": "",
        "sLastname": ""
    };

    this.mirror = helper.clone(this.fields);

    const that = this;
    // Getter und Setter
    this.get = {
        contactID: function () {
            return that.fields.contactID;
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
        contactID: function (sID) {
            that.fields.contactID = sID;
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
     * @alias module:classes.Contact.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.contactID(),
            "username": this.get.sUsername(),
            "dtSince": this.get.dtSince(),
            "dtAccess": this.get.dtAccess(),
            "email": this.get.sEmail(),
            "firstname": this.get.sFirstname(),
            "lastname": this.get.sLastname()
        };
    };

    /**
     * Updates the current users dtAccess value in the Database.
     * @alias module:classes.Contact.updateAccess
     * @returns {Promise}
     */
    this.updateAccess = function () {
        if (this.get.dtAccess() + enums.unixTime.Minute > helper.currentTimestamp()) {
            return helper.startPromiseChain();
        }
        this.set.dtAccess(helper.currentTimestamp());
        return __dbhandler.update(this);
    };

};
