"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var errorcode = helper.getErrorcodes();
var prohelper = require("../../../prohelper");
var classes = require("../../../classes");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.contact);
var bcrypt = require("bcryptjs");
var Cookie = require("cookies");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /contact/login Login
 * @apiVersion  1.0.0
 * @apiName LoginContact
 * @apiGroup ContactAuthorization
 * @apiPermission none
 *
 * @apiDescription Login a contact. This request will set a cookie <code>C-SESSION</code> which has stored the session ID in it. To do request with permission like <code>Contact.Permission</code>, the cookie data needs to be transmitted.
 *
 * @apiParam  {String}      group       ID of the contact group
 * @apiParam  {String}      username    The contact username or email
 * @apiParam  {String}      password    The contact password
 * @apiParam  {Boolean}     [cookie]    Flag if the cookie should be stored longer than the current session
 *
 * @apiExample {json} Request Example:
 *      {
 *          "group": "0A1B",
 *          "username": "iamcontact",
 *          "password": "myverysavepassword",
 *          "cookie": true
 *      }
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
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "WrongNameOrPass"
 *      }
 *
 * @apiError    MissingRequiredValues       Required parameters are not set. See respnse for mission values.
 * @apiError    WrongNameOrPass             Username/Email or password is incorrect.
 */
exports.post = function (req, res) {
    var oContact = new classes.Contact();
    helper.startPromiseChain()
        .then(function () {
            if (!config.session.contact.enabled) {
                throw {
                    "type": errorcode.ERR_ressourceLocked,
                    "SERR": "ServerContactSectionDisabled"
                };
            }
            return;
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["group", req.body.group],
                ["username", req.body.username],
                ["password", req.body.password]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchContactLogin", [req.body.group, req.body.username]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "WrongNameOrPass"
                };
            }
            oContact = new classes.Contact(aData[0]);
            return bcrypt.compare(req.body.password, oContact.get.sPassword());
        })
        .then(function (bPassw) {
            if (!bPassw) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "WrongNameOrPass"
                };
            }
            return session.startSession(new Cookie(req, res), {
                "session": true,
                "cookie": req.body.cookie,
                "redis": oContact.get.contactID()
            });
        })
        .then(function () {
            return oContact.updateAccess();
        })
        .then(function () {
            res.json(oContact.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
