"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /member/data Data
 * @apiVersion  1.0.0
 * @apiName DataMember
 * @apiGroup MemberAuthorization
 * @apiPermission Member
 *
 * @apiDescription Load the data of the current Member.
 *
 * @apiExample {json} Response Example:
 *  HTTP/1.1 200 OK
 *  Content-Type: application/json; charset=utf-8
 *  {
 *      "id": "AB12fg91",
 *      "idContact": "HS2k4Sq26",
 *      "idGroup": "0A1B",
 *      "username": "iammember",
 *      "permission": "1",
 *      "since": 1424810726,
 *      "access": 1524810726,
 *      "email": "iammember@email.com",
 *      "firstname": "Liam",
 *      "lastname": "Member"
 *  }
 *
 * @apiExample {json} Error-Response Example:
 *  HTTP/1.1 401 Unauthorized
 *  Content-Type: application/json; charset=utf-8
 *  {
 *      "SERR": "NoCurrentMember"
 *  }
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
