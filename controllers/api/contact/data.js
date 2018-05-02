"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.contact);
var bcrypt = require("bcryptjs");
var errorcode = helper.getErrorcodes();
var classes = require("../../../classes");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /contact/data Load Data
 * @apiVersion  1.0.0
 * @apiName LoadDataContact
 * @apiGroup ContactAuthorization
 * @apiPermission Contact
 *
 * @apiDescription Load the data of the current Member.
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "AB12fg911",
 *          "idGroup": "0A1B",
 *          "username": "iamcontact",
 *          "dtSince": 1424810726,
 *          "dtAccess": 1524810726,
 *          "email": "iamcontact@email.com",
 *          "firstname": "Liam",
 *          "lastname": "Contact"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 403 Forbidden
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoCurrentContact"
 *      }
 *
 * @apiError    NoCurrentContact        Currently there is no contact logged in.
 */
exports.get = function (req, res) {
    session.loadSessionData(req, res, prohelper.loadContactSessionData)
        .then(function () {
            res.json(req.oSessiondata.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /contact/data Change Data
 * @apiVersion  1.0.0
 * @apiName ChangeDataContact
 * @apiGroup ContactAuthorization
 * @apiPermission Contact
 *
 * @apiDescription Change the data of the current Contact.
 *
 * @apiParam  {String}      password        The passsword for the current contact.
 * @apiParam  {String}      [newUsername]   A new username for the current contact.
 * @apiParam  {String}      [newPassword]   A new password for the current contact.
 * @apiParam  {String}      [email]         A new email for the current contact.
 * @apiParam  {String}      [firstname]     A new firstname for the current contact.
 * @apiParam  {String}      [lastname]      A new lastname for the current contact.
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
 *          "SERR": "NoCurrentContact"
 *      }
 *
 * @apiError    NoCurrentContact        Currently there is no contact logged in.
 * @apiError    WrongPass               Wrong password for the current contact.
 * @apiError    InvalidEmail            The email adress is not valid.
 * @apiError    UsernameAlreadyExist    The username is already in use.
 * @apiError    EmailAlreadyExist       The email adress is already in use.
 * @apiError    ContactIsMember         The contact cant change here because it's a Member.
 */
exports.put = function (req, res) {
    var oContact = new classes.Contact();
    session.loadSessionData(req, res, prohelper.loadContactSessionData)
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
            if (helper.isset(req.body.email) && !helper.validateEmail(req.body.email)) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "InvalidEmail"
                };
            }
            oContact = new classes.Contact(req.oSessiondata.fields);
            return __dbhandler.fetch("FetchMemberGroupContact", [req.oSessiondata.get.idGroup(), oContact.get.contactID()]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactIsMember"
                };
            }
            if (helper.isset(req.body.newUsername) && req.body.newUsername !== oContact.get.sUsername()) {
                return __dbhandler.fetch("FetchContactGroupUsername", [req.oSessiondata.get.idGroup(), req.body.newUsername]);
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
            if (helper.isset(req.body.email) && req.body.email !== oContact.get.sEmail()) {
                return __dbhandler.fetch("FetchContactGroupEmail", (req.oSessiondata.get.idGroup(), req.body.email));
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
            return;
        })
        .then(function () {
            if (helper.isset(req.body.firstname)) {
                oContact.set.sFirstname(req.body.firstname);
            }
            if (helper.isset(req.body.lastname)) {
                oContact.set.sLastname(req.body.lastname);
            }
            if (helper.isset(req.body.newUsername)) { // Prüfung ob schon existiert hinzufügen?
                oContact.set.sUsername(req.body.newUsername);
            }

            if (helper.isset(req.body.email)) { // Prüfung ob schon existiert hinzufügen?
                oContact.set.sEmail(req.body.email);
            }
            if (helper.isset(req.body.newPassword)) {
                return bcrypt.hash(req.body.newPassword, 10)
                    .then(function (sPassword) {
                        oContact.set.sPassword(sPassword);
                    });
            }
            return;
        })
        .then(function () {
            return __dbhandler.update(oContact);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
