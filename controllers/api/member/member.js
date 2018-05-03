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
var classEnums = require("../../../classes/_classEnums");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/member Add Member
 * @apiVersion  1.0.0
 * @apiName AddMember
 * @apiGroup Member
 * @apiPermission Member Member.Add | Member.Add.Permission
 *
 * @apiDescription Add a new member and a contact with same data.
 *
 * @apiParam  {String}      username        A not exsisting username for login.
 * @apiParam  {String}      password        A safe password for login.
 * @apiParam  {String}      email           A not existing email also for login.
 * @apiParam  {String}      [firstname]     The members firstname.
 * @apiParam  {String}      [lastname]      The members lastname.
 * @apiParam  {String[]}    [permission]    REQUIRE PERMISSION: Member.Add.Permission! The new members permission. Current member can only set own permissions.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "username": "newmember",
 *          "password": "newmemberpassword",
 *          "email": "new@mem.com",
 *          "firstname": "New",
 *          "lastname": "Member",
 *          "permission": [
 *              "Note"
 *          ]
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "c92qUQDo"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "UsernameAlreadyExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    InvalidEmail            The email adress is not valid.
 * @apiError    UsernameAlreadyExist    The username is already in use.
 * @apiError    EmailAlreadyExist       The email adress is already in use.
 */
exports.post = function (req, res) {
    var oMember = new classes.Member();
    var oContact = new classes.Contact();
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
            return __dbhandler.fetch("FetchContactGroupUsername", [req.oSessiondata.get.idGroup(), req.body.username]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "UsernameAlreadyExist"
                };
            }
            return __dbhandler.fetch("FetchContactGroupEmail", [req.oSessiondata.get.idGroup(), req.body.email]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "EmailAlreadyExist"
                };
            }
            return bcrypt.hash(req.body.password, 10);
        })
        .then(function (sHash) {
            oContact.set.idGroup(req.oSessiondata.get.idGroup());
            oContact.set.sUsername(req.body.username);
            oContact.set.sPassword(sHash);
            oContact.set.sEmail(req.body.email);
            if (helper.isset(req.body.firstname)) {
                oContact.set.sFirstname(req.body.firstname);
            }
            if (helper.isset(req.body.lastname)) {
                oContact.set.sLastname(req.body.lastname);
            }
            return;
        })
        .then(function () {
            oMember.set.idGroup(oContact.get.idGroup());
            oMember.set.sUsername(oContact.get.sUsername());
            oMember.set.sPassword(oContact.get.sPassword());
            oMember.set.sEmail(oContact.get.sEmail());
            oMember.set.sFirstname(oContact.get.sFirstname());
            oMember.set.sLastname(oContact.get.sLastname());
            if (helper.isset(req.body.permission) &&
                req.oSessiondata.hasPermission("Member.Add.Permission", true)) {
                var sPerm = "";
                for (var i = 0; i < classEnums.MemberPermissions.length; i += 1) {
                    if (req.body.permission.includes(classEnums.MemberPermissions[i]) &&
                        req.oSessiondata.hasPermission(classEnums.MemberPermissions[i], true)) {
                        sPerm += "1";
                    } else {
                        sPerm += "0";
                    }
                }
                oMember.set.cPermission(sPerm);
            }
            return;
        })
        .then(function () {
            return __dbhandler.insert(oContact);
        })
        .then(function () {
            oMember.set.idContact(oContact.get.contactID());
            return __dbhandler.insert(oMember);
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

/**
 * @api {get} /member/member Load Member
 * @apiVersion  1.0.0
 * @apiName LoadMember
 * @apiGroup Member
 * @apiPermission Member Member.View
 *
 * @apiDescription Load a existing member.
 *
 * @apiParam  {String}      id      ID of an existing member.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "c92qUQDo"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "c92qUQDo",
 *          "idContact": "Lo74Vsqo",
 *          "idGroup": "0000",
 *          "username": "newmember3",
 *          "permission": [
 *              "Note"
 *          ],
 *          "dtSince": 1525295878,
 *          "dtAccess": null,
 *          "email": "new@member3.com",
 *          "firstname": "New",
 *          "lastname": "Member"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "MemberNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MemberNotExist          A member with the current id doesn't exist.
 */
exports.get = function (req, res) {
    var oMember = new classes.Member();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Member.View");
        })
        .then(function () {
            return helper.isset([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMemberGroupID", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "MemberNotExist"
                };
            }
            oMember = new classes.Member(aData[0]);
        })
        .then(function () {
            res.json(oMember.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/member Change Member
 * @apiVersion  1.0.0
 * @apiName ChangeMember
 * @apiGroup Member
 * @apiPermission Member Member.Change | Member.Change.Login | Member.Change.Permission
 *
 * @apiDescription Change a existing member and the connected contact.
 *
 * @apiParam  {String}      id              ID of an existing member.
 * @apiParam  {String}      [email]         New email for member.
 * @apiParam  {String}      [firstname]     New firstname for member.
 * @apiParam  {String}      [lastname]      New lastname for member.
 * @apiParam  {String}      [username]      REQUIRE PERMISSION: Member.Change.Login! New username for member.
 * @apiParam  {String}      [password]      REQUIRE PERMISSION: Member.Change.Login! New password for member.
 * @apiParam  {Object}      [permission]    REQUIRE PERMISSION: Member.Change.Permission! Add more Permission or delete some.
 * @apiParam  {String[]}    [permission.new]        Add more Permission.
 * @apiParam  {String[]}    [permission.del]        Delete some Permission.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "ZlQU3bMS",
 *          "email": "new@mail.de",
 *          "firstname": "Newfirst",
 *          "lastname": "Newlast",
 *          "username": "newusername",
 *          "password": "newpassword",
 *          "permission": {
 *              "new": [
 *                  "Member.View"
 *              ],
 *              "del": [
 *                  "Contact.View"
 *              ]
 *          }
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "QN2AYwiP8"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoMemberContact"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MemberNotExist          A member with the current id doesn't exist.
 * @apiError    NoMemberContact         The selected member has no contact. Contact admin for fix.
 * @apiError    InvalidEmail            The email adress is not valid.
 * @apiError    UsernameAlreadyExist    The username is already in use.
 * @apiError    EmailAlreadyExist       The email adress is already in use.
 */
exports.put = function (req, res) {
    var oMember = new classes.Member();
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Member.Change");
        })
        .then(function () {
            return helper.isset([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMemberGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "MemberNotExist"
                };
            }
            oMember = new classes.Member(aData[0]);
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), oMember.get.idContact()]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "NoMemberContact"
                };
            }
            oContact = new classes.Contact(aData[0]);
            return;
        })
        .then(function () {
            if (helper.isset(req.body.username) &&
                req.oSessiondata.hasPermission("Member.Change.Login", true) &&
                req.body.username !== "" &&
                req.body.username !== oMember.get.sUsername()) {
                return __dbhandler.fetch("FetchContactGroupUsername", [req.oSessiondata.get.idGroup(), req.body.username]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "UsernameAlreadyExist"
                };
            }
            if (
                helper.isset(req.body.email) &&
                req.body.email !== "" &&
                req.body.email !== oMember.get.sEmail()) {
                if (!helper.validateEmail(req.body.email)) {
                    throw {
                        "type": errorcode.ERR_individualError,
                        "SERR": "InvalidEmail"
                    };
                }
                return __dbhandler.fetch("FetchContactGroupEmail", [req.oSessiondata.get.idGroup(), req.body.email]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "EmailAlreadyExist"
                };
            }
            if (helper.isset(req.body.password) &&
                req.oSessiondata.hasPermission("Contact.Change.Login", true) &&
                req.body.password !== "") {
                return bcrypt.hash(req.body.password, 10);
            }
            return;
        })
        .then(function (sHash) { // eslint-disable-line
            if (helper.isset(req.body.username) &&
                req.oSessiondata.hasPermission("Member.Change.Login", true)) {
                oMember.set.sUsername(req.body.username);
                oContact.set.sUsername(req.body.username);
            }
            if (helper.isset(req.body.password) &&
                req.oSessiondata.hasPermission("Member.Change.Login", true)) {
                oMember.set.sPassword(sHash);
                oContact.set.sPassword(sHash);
            }
            if (helper.isset(req.body.email)) {
                oMember.set.sEmail(req.body.email);
                oContact.set.sEmail(req.body.email);
            }
            if (helper.isset(req.body.firstname)) {
                oMember.set.sFirstname(req.body.firstname);
                oContact.set.sFirstname(req.body.firstname);
            }
            if (helper.isset(req.body.lastname)) {
                oMember.set.sLastname(req.body.lastname);
                oContact.set.sLastname(req.body.lastname);
            }
            if (helper.isset(req.body.permission) &&
                req.oSessiondata.hasPermission("Member.Change.Permission", true)) {
                var sPerm = "";
                for (var i = 0; i < classEnums.MemberPermissions.length; i += 1) {
                    if (req.body.permission.new.includes(classEnums.MemberPermissions[i]) &&
                        req.oSessiondata.hasPermission(classEnums.MemberPermissions[i], true) ||
                        oMember.hasPermission(classEnums.MemberPermissions[i], true) &&
                        !(req.body.permission.del.includes(classEnums.MemberPermissions[i]) &&
                            req.oSessiondata.hasPermission(classEnums.MemberPermissions[i], true))) {
                        sPerm += "1";
                    } else {
                        sPerm += "0";
                    }
                }
                oMember.set.cPermission(sPerm);
            }
            return;
        })
        .then(function () {
            return __dbhandler.update(oContact);
        })
        .then(function () {
            return __dbhandler.update(oMember);
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

/**
 * @api {delete} /member/member Delete Member
 * @apiVersion  1.0.0
 * @apiName DeleteMember
 * @apiGroup Member
 * @apiPermission Member Member.Delete
 *
 * @apiDescription Delete a existing member.
 *
 * @apiParam  {String}      id          A id of an existing member.
 * @apiParam  {Boolean}     [contact]   Delete the connected contact too.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "QN2AYwiP8",
 *          "contact: true"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "MemberNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MemberNotExist          A member with the current id doesn't exist.
 */
exports.delete = function (req, res) {
    var oMember = new classes.Member();
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Member.Delete");
        })
        .then(function () {
            return helper.isset([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMemberGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "MemberNotExist"
                };
            }
            oMember = new classes.Member(aData[0]);
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), oMember.get.idContact()]);
        })
        .then(function (aData) {
            // if (aData.length === 0) {
            //     throw {
            //         "type": errorcode.ERR_individualError,
            //         "SERR": "NoMemberContact"
            //     };
            // }
            oContact = new classes.Contact(aData[0]);
            return;
        })
        .then(function () {
            return __dbhandler.delete(oMember);
        })
        .then(function () {
            if (!helper.isTrue(req.body.contact) ||
                oContact.get.contactID().trim().length === 0) {
                return;
            }
            return __dbhandler.delete(oContact);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
