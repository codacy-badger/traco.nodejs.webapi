"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.contact);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /contact/data Data
 * @apiVersion  1.0.0
 * @apiName DataContact
 * @apiGroup ContactAuthorization
 * @apiPermission Contact
 *
 * @apiDescription Load the data of the current Member.
 *
 * @apiExample {json} Response Example:
 *  HTTP/1.1 200 OK
 *  Content-Type: application/json; charset=utf-8
 *  {
 *      "id": "AB12fg911",
 *      "idGroup": "0A1B",
 *      "username": "iamcontact",
 *      "since": 1424810726,
 *      "access": 1524810726,
 *      "email": "iamcontact@email.com",
 *      "firstname": "Liam",
 *      "lastname": "Contact"
 *  }
 *
 * @apiExample {json} Error-Response Example:
 *  HTTP/1.1 401 Unauthorized
 *  Content-Type: application/json; charset=utf-8
 *  {
 *      "SERR": "NoCurrentContact"
 *  }
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
