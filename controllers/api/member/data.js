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

/**
 * @api {get} /member/data Load Data
 * @apiVersion  1.0.0
 * @apiName LoadDataMember
 * @apiGroup MemberAuthorization
 * @apiPermission Member
 *
 * @apiDescription Load the data of the current Member.
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "AB12fg91",
 *          "idContact": "HS2k4Sq26",
 *          "idGroup": "0A1B",
 *          "username": "iammember",
 *          "permission": "11",
 *          "dtSince": 1424810726,
 *          "dtAccess": 1524810726,
 *          "email": "iammember@email.com",
 *          "firstname": "Liam",
 *          "lastname": "Member"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 403 Forbidden
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoCurrentMember"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 */
exports.get = function (req, res) {
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            res.json(req.oSessiondata.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/data Change Data
 * @apiVersion  1.0.0
 * @apiName ChangeDataMember
 * @apiGroup MemberAuthorization
 * @apiPermission Member
 *
 * @apiDescription Change the data of the current member and the data of the contact asigned to the member.
 *
 * @apiParam  {String}      password        The passsword for the current member.
 * @apiParam  {String}      [newUsername]   A new username for the current member.
 * @apiParam  {String}      [newPassword]   A new password for the current member.
 * @apiParam  {String}      [email]         A new email for the current member.
 * @apiParam  {String}      [firstname]     A new firstname for the current member.
 * @apiParam  {String}      [lastname]      A new lastname for the current member.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "password": "myverysavepassword",
 *          "newUsername": "mynewusername",
 *          "newPassword": "myverysafenewpassword",
 *          "email": "mymail@adresse.com",
 *          "firstname": "Myname",
 *          "lastname": "Hasmore"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 403 Forbidden
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoCurrentMember"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    WrongPass               Wrong password for the current member.
 */
exports.put = function (req, res) {
    var oMember = new classes.Member();
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return helper.checkRequiredValues([
                ["password", req.body.password]
            ]);
        })
        .then(function () {
            return bcrypt.compare(req.body.password, req.oSessiondata.get.sPassword());
        })
        .then(function (bPassw) {
            if (!bPassw) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "WrongPass"
                };
            }
            oMember = new classes.Member(req.oSessiondata.fields);
            return __dbhandler.fetch("FetchContactID", [oMember.get.memberID()]);
        })
        .then(function (aData) {
            oContact = new classes.Contact(aData[0]);
            if (req.body.firstname) {
                oMember.set.sFirstname(req.body.firstname);
                oContact.set.sFirstname(req.body.firstname);
            }
            if (req.body.lastname) {
                oMember.set.sLastname(req.body.lastname);
                oContact.set.sLastname(req.body.lastname);
            }

            if (req.body.newUsername) { // Prüfung ob schon existiert hinzufügen?
                oMember.set.sUsername(req.body.newUsername);
                oContact.set.sUsername(req.body.newUsername);
            }
            if (req.body.email) { // Prüfung ob schon existiert hinzufügen?
                oMember.set.sEmail(req.body.email);
                oContact.set.sEmail(req.body.email);
            }
            if (req.body.newPassword) {
                return bcrypt.hash(req.body.newPassword, 10)
                    .then(function (sPassword) {
                        oMember.set.sPassword(sPassword);
                        oContact.set.sPassword(sPassword);
                    });
            }
            return;
        })
        .then(function () {
            return __dbhandler.insertOrUpdate(oContact);
        })
        .then(function () {
            return __dbhandler.insertOrUpdate(oMember);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
