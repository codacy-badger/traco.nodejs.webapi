"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var errorcode = helper.getErrorcodes();
var prohelper = require("../../../prohelper");
var classes = require("../../../classes");
var config = require("../../../static/config.json");
var session = require("../../../module/session")(config.session.member);
var dbhandler = require("../../../dbhandler")(config.mysql, require("../../../static/dbcursor.json"));
var bcrypt = require("bcryptjs");
var Cookie = require("cookies");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/login Login
 * @apiVersion  1.0.0
 * @apiName LoginMember
 * @apiGroup MemberAuthorization
 * @apiPermission none
 *
 * @apiDescription Login a member. This request will set a cookie <code>MSESSION</code> which has stored the session ID in it. To do request with permission like <code>Member.Permission</code>, the cookie data needs to be transmitted.
 *
 * @apiParam  {String}      group       ID of the members group
 * @apiParam  {String}      username    The members username or email
 * @apiParam  {String}      password    The members password
 * @apiParam  {Boolean}     cookie      Flag if the cookie should be stored longer than the current session
 *
 * @apiParamExample  {json} Request-Example:
 *  {
 *      "group": "0A1B",
 *      "username": "iammember",
 *      "password": "myverysavepassword",
 *      "cookie": true
 *  }
 */
exports.post = function (req, res) {
    var oMember = new classes.Member();
    helper.checkRequiredValues([
        ["username", req.body.username],
        ["password", req.body.password]
    ])
        .then(function () {
            return dbhandler.fetch("FetchMemberLogin", [req.body.group, req.body.username]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_invalidUserPermission,
                    "SERR": "WrongNameOrPassword"
                };
            }
            oMember = new classes.Member(aData[0]);
            return bcrypt.compare(req.body.password, oMember.get.sPassword());
        })
        .then(function (bPassw) {
            if (!bPassw) {
                throw {
                    "type": errorcode.ERR_invalidUserPermission,
                    "SERR": "WrongNameOrPassword"
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
