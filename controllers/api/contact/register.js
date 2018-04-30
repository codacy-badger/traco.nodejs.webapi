"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var errorcode = helper.getErrorcodes();
var prohelper = require("../../../prohelper");
var classes = require("../../../classes");
var bcrypt = require("bcryptjs");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /contact/register Register Contact
 * @apiVersion  1.0.0
 * @apiName RegisterContact
 * @apiGroup ContactAuthorization
 * @apiPermission none
 *
 * @apiDescription Registrate a new contact for a spezific group without permission needs. It just registrate the new Contact. Login is a different API.
 *
 * @apiParam  {String}      group           The id for the group where the contact want to be.
 * @apiParam  {String}      username        A username for login.
 * @apiParam  {String}      password        A password for login.
 * @apiParam  {String}      email           A email adress for contacting ouside the system and also for login.
 * @apiParam  {String}      [firstname]     The contacts firstname shown for everyone else.
 * @apiParam  {String}      [lastname]      The contacts lastname shown for everyone else.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "group": "0000",
 *          "username": "myusername",
 *          "password": "averysafepassword",
 *          "email": "myemail@adress.com",
 *          "firstname": "Myfirstname",
 *          "lastname": "Andlastname"
 *      }
 *
 * @apiExample Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "UsernameAlreadyUsed"
 *      }
 *
 * @apiError        GroupNotExist           The groupID doesn't exist.
 * @apiError        InvalidEmail            The email adress is not valid.
 * @apiError        UsernameAlreadyUsed     The username is already in use.
 * @apiError        EmailAlreadyUsed        The email adress is already in use.
 */
exports.post = function (req, res) {
    var oContact = new classes.Contact();
    helper.checkRequiredValues([
        ["group", req.body.group],
        ["username", req.body.username],
        ["password", req.body.password],
        ["email", req.body.email]
    ])
        .then(function () {
            return __dbhandler.fetch("FetchGroupID", [req.body.group]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupNotExist"
                };
            }
            if (!helper.validateEmail(req.body.email)) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "InvalidEmail"
                };
            }
            return __dbhandler.fetch("FetchContactUsername", [req.body.group, req.body.username]);

        })
        .then(function (aData) {
            if (aData.length > 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "UsernameAlreadyUsed"
                };
            }
            return __dbhandler.fetch("FetchContactEmail", [req.body.group, req.body.email]);
        })
        .then(function (aData) {
            if (aData.length > 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "EmailAlreadyUsed"
                };
            }
            return bcrypt.hash(req.body.password, 10);
        })
        .then(function (sHash) {
            oContact.set.idGroup(req.body.group);
            oContact.set.sUsername(req.body.username);
            oContact.set.sPassword(sHash);
            oContact.set.sEmail(req.body.email);
            if (req.body.firstname) {
                oContact.set.sFirstname(req.body.firstname);
            }
            if (req.body.lastname) {
                oContact.set.sLastname(req.body.lastname);
            }
            return __dbhandler.insert(oContact);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
