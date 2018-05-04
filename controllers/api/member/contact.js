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
 * @api {post} /member/contact Add Contact
 * @apiVersion  1.0.0
 * @apiName AddContact
 * @apiGroup Contact
 * @apiPermission Member Contact.Add
 *
 * @apiDescription Add a new contact.
 *
 * @apiParam  {String}      username        A not existing username to login into contactsites.
 * @apiParam  {String}      password        A password to login into contactsites.
 * @apiParam  {String}      email           A not existing email to login into contactsites.
 * @apiParam  {String}      [firstname]     The contacts firstname.
 * @apiParam  {String}      [lastname]      The contacts lastname.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "username": "mycontact",
 *          "password": "mycontactsverysafepassword",
 *          "email": "myuser@email.com",
 *          "firstname": "Myname",
 *          "lastname": "Andlastname"
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
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Contact.Add");
        })
        .then(function () {
            return helper.checkRequiredValues([
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
            return __dbhandler.fetch("FetchContactGroupEmail", (req.oSessiondata.get.idGroup(), req.body.email));
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
            return __dbhandler.insert(oContact);
        })
        .then(function () {
            res.json({
                "id": oContact.get.contactID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/contact Load Contact
 * @apiVersion  1.0.0
 * @apiName LoadContact
 * @apiGroup Contact
 * @apiPermission Member Contact.View
 *
 * @apiDescription Load a existing contact.
 *
 * @apiParam  {String}      id      Id of an existing contact.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "QN2AYwiP8"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "QN2AYwiP8",
 *          "dtSince": 1525255330,
 *          "dtAccess": null,
 *          "email": "myuser@email.com",
 *          "firstname": "Myname",
 *          "lastname": "Andlastname"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "ContactNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    ContactNotExist         A contact with the current id doesn't exist.
 */
exports.get = function (req, res) {
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Contact.View");
        })
        .then(function () {
            return helper.checkRequiredValues([
            ["id", req.query.id]
        ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactNotExist"
                };
            }
            oContact = new classes.Contact(aData[0]);
            return;
        })
        .then(function () {
            res.json(oContact.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/contact Change Contact
 * @apiVersion  1.0.0
 * @apiName ChangeContact
 * @apiGroup Contact
 * @apiPermission Member Contact.Change | Contact.Change.Login
 *
 * @apiDescription Change a existing contact.
 *
 * @apiParam  {String}      id              ID of an existing contact.
 * @apiParam  {String}      [email]         New email adresse.
 * @apiParam  {String}      [firstname]     New contacts firstname.
 * @apiParam  {String}      [lastname]      New contacts lastname.
 * @apiParam  {String}      [username]      REQUIRE PERMISSION: Contact.Change.Login! New contacts username.
 * @apiParam  {String}      [password]      REQUIRE PERMISSION: Contact.Change.Login! New contacts password.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "QN2AYwiP8",
 *          "email": "newmail@new.de",
 *          "firstname": "Newname",
 *          "lastname": "Andlast",
 *          "username": "newcon",
 *          "password": "newcon"
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
 *          "SERR": "UsernameAlreadyExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    ContactNotExist         A contact with the current id doesn't exist.
 * @apiError    ContactIsMember         The selected contact is a member and can't deleted here.
 * @apiError    InvalidEmail            The email adress is not valid.
 * @apiError    UsernameAlreadyExist    The username is already in use.
 * @apiError    EmailAlreadyExist       The email adress is already in use.
 */
exports.put = function (req, res) {
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Contact.Change");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactNotExist"
                };
            }
            oContact = new classes.Contact(aData[0]);
            return __dbhandler.fetch("FetchMemberGroupContact", [req.oSessiondata.get.idGroup(), oContact.get.contactID()]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactIsMember"
                };
            }
        })
        .then(function () {
            if (helper.isset(req.body.username) &&
                req.oSessiondata.hasPermission("Contact.Change.Login", true) &&
                req.body.username !== "" &&
                req.body.username !== oContact.get.sUsername()) {
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
                req.body.email !== oContact.get.sEmail()) {
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
        .then(function (sHash) {
            if (helper.isset(req.body.username) &&
                req.oSessiondata.hasPermission("Contact.Change.Login", true)) {
                oContact.set.sUsername(req.body.username);
            }
            if (helper.isset(req.body.password) &&
                req.oSessiondata.hasPermission("Contact.Change.Login", true)) {
                oContact.set.sPassword(sHash);
            }
            if (helper.isset(req.body.email)) {
                oContact.set.sEmail(req.body.email);
            }
            if (helper.isset(req.body.firstname)) {
                oContact.set.sFirstname(req.body.firstname);
            }
            if (helper.isset(req.body.lastname)) {
                oContact.set.sLastname(req.body.lastname);
            }
            return __dbhandler.update(oContact);
        })
        .then(function () {
            res.json({
                "id": oContact.get.contactID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/contact Delete Contact
 * @apiVersion  1.0.0
 * @apiName DeleteContact
 * @apiGroup Contact
 * @apiPermission Member Contact.Delete
 *
 * @apiDescription Delete a existing contact.
 *
 * @apiParam  {String}      id          A id of an existing contact
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "QN2AYwiP8"
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
 *          "SERR": "ContactNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    ContactNotExist         A contact with the current id doesn't exist.
 * @apiError    ContactIsMember         The selected contact is a member and can't deleted here.
 */
exports.delete = function (req, res) {
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Contact.Delete");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactNotExist"
                };
            }
            oContact = new classes.Contact(aData[0]);
            return __dbhandler.fetch("FetchMemberGroupContact", [req.oSessiondata.get.idGroup(), oContact.get.contactID()]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactIsMember"
                };
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
