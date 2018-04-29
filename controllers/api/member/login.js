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
var session = new Session(config.session.member);
var bcrypt = require("bcryptjs");
var Cookie = require("cookies");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/login Login
 * @apiVersion  1.0.0
 * @apiName LoginMember
 * @apiGroup MemberAuthorization
 * @apiPermission none
 *
 * @apiDescription Login a member. This request will set a cookie <code>M-SESSION</code> which has stored the session ID in it. To do request with permission like <code>Member.Permission</code>, the cookie data needs to be transmitted.
 *
 * @apiParam  {String}      group       ID of the members group
 * @apiParam  {String}      username    The members username or email
 * @apiParam  {String}      password    The members password
 * @apiParam  {Boolean}     [cookie]    Flag if the cookie should be stored longer than the current session
 *
 * @apiExample {json} Request Example:
 *      {
 *          "group": "0A1B",
 *          "username": "iammember",
 *          "password": "myverysavepassword",
 *          "cookie": true
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "AB12fg91",
 *          "idContact": "HS2k4Sq26",
 *          "idGroup": "0A1B",
 *          "username": "iammember",
 *          "permission": "1",
 *          "dtSince": 1424810726,
 *          "dtAccess": 1524810726,
 *          "email": "iammember@email.com",
 *          "firstname": "Liam",
 *          "lastname": "Member"
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
    var oMember = new classes.Member();
    helper.checkRequiredValues([
        ["group", req.body.group],
        ["username", req.body.username],
        ["password", req.body.password]
    ])
        .then(function () {
            return __dbhandler.fetch("FetchMemberLogin", [req.body.group, req.body.username]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "WrongNameOrPass"
                };
            }
            oMember = new classes.Member(aData[0]);
            return bcrypt.compare(req.body.password, oMember.get.sPassword());
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
                "redis": oMember.get.memberID()
            });
        })
        .then(function () {
            return oMember.updateAccess();
        })
        .then(function () {
            res.json(oMember.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
