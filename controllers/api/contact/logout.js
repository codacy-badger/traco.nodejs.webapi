"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.contact);
var Cookie = require("cookies");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /contact/logout Logout
 * @apiVersion  1.0.0
 * @apiName LogoutContact
 * @apiGroup ContactAuthorization
 * @apiPermission Contact
 *
 * @apiDescription Logout the current contact.
 *
 * @apiExample Response Example:
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
 */
exports.post = function (req, res) {
    session.loadSessionData(req, res, prohelper.loadContactSessionData)
        .then(function () {
            return req.oSessiondata.updateAccess();
        })
        .then(function () {
            return session.endSession(new Cookie(req, res), {
                sessionid: req.clientdata.sessionid
            });
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
