"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);
var bcrypt = require("bcryptjs");
var errorcode = helper.getErrorcodes();
var classes = require("../../../classes");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


exports.post = function (req, res) {
    var oMember = new classes.Member();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Member.Add");
        })
        .then(function () {
            return helper.isset([
                ["username", req.body.username],
                ["password", req.body.password],
                ["email", req.body.email]
            ]);
        })
        .then(function () {
            if (!helper.validateEmail(req.body.email)) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "InvalidEmail"
                };
            }
            return __dbhandler.fetch("FetchMemberGroupUsername", [req.oSessiondata.get.idGroup(), req.body.username]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "UsernameAlreadyExist"
                };
            }
            return __dbhandler.fetch("FetchMemberGroupEmail", [req.oSessiondata.get.idGroup(), req.body.email]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "EmailAlreadyExist"
                };
            }

        })
        .then(function () {

        })
        .then(function () {

        })
        .then(function () {

        })
        .then(function () {

        })
        .then(function () {
            res.json({
                "id": oMember.get.memberID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
