"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");
var classes = require("../classes");
var enums = helper.getEnums();
var errorcode = helper.getErrorcodes();
var classEnums = require("./_classEnums");

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
        "cPermission": "0000000000000000000000000",
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
     * @alias module:classes.Member.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        var fPermissionGen = function () {
            var aPerm = [];
            var i = 0;
            while (i < classEnums.MemberPermissions.length) {
                if (that.hasPermission(classEnums.MemberPermissions[i], true)) {
                    aPerm.push(classEnums.MemberPermissions[i]);
                }
                i += 1;
            }
            return aPerm;
        };
        return {
            "id": this.get.memberID(),
            "idContact": this.get.idContact(),
            "idGroup": this.get.idGroup(),
            "username": this.get.sUsername(),
            "permission": fPermissionGen(),
            "dtSince": this.get.dtSince(),
            "dtAccess": this.get.dtAccess(),
            "email": this.get.sEmail(),
            "firstname": this.get.sFirstname(),
            "lastname": this.get.sLastname()
        };
    };

    /**
     * Updates the current users dtAccess value in the Database.
     * @alias module:classes.Member.updateAccess
     * @returns {Promise}
     */
    this.updateAccess = function () {
        var oContact = new classes.Contact();
        if (this.get.dtAccess() + enums.unixTime.Minute > helper.currentTimestamp()) {
            return helper.startPromiseChain();
        }
        this.set.dtAccess(helper.currentTimestamp());
        return __dbhandler.update(this)
            .then(function () {
                return __dbhandler.fetch("FetchContactID", [that.get.idContact()]);
            })
            .then(function (aData) {
                oContact = new classes.Contact(aData[0]);
                return oContact.updateAccess();
            });
    };

    /**
     * Check the permission of the user.
     * @alias module:classes.Member.hasPermission
     * @param {string} sPermission
     * @param {boolean} [bAsbool]
     * @returns {Promise|boolean}
     */
    this.hasPermission = function (sPermission, bAsbool) {
        var bReturn = false;
        if (helper.isTrue(this.fields.cPermission[classEnums.MemberPermissions.indexOf(sPermission)]) ||
            helper.isTrue(this.fields.cPermission[classEnums.MemberPermissions.indexOf("Admin")])) {
            bReturn = true;
        }
        if (bAsbool) {
            return bReturn;
        }
        return new Promise(function (fFulfill, fReject) {
            if (bReturn === true) {
                fFulfill();
            } else {
                fReject({
                    "type": errorcode.ERR_invalidPermission,
                    "SERR": "NotEnoughPermission"
                });
            }
        });
    };
};
