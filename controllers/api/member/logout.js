"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);
var Cookie = require("cookies");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/logout Logout
 * @apiVersion  1.0.0
 * @apiName LogoutMember
 * @apiGroup MemberAuthorization
 * @apiPermission Member
 *
 * @apiDescription Logout the current member.
 *
 * @apiExample Response Example:
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
 */
exports.post = function (req, res) {
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
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
