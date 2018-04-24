var cursor = {
    "Test": "SELECT * FROM `user` WHERE `sEmail` = @0 AND cPermission = @1"
}
var dbhandler = require("../dbhandler")(require("../static/config.json").mysql, cursor);
var classes = require("../classes");

var oUser = new classes.User();

oUser.set.sUsername("askjdbak");
oUser.set.sEmail("sssssss@1mein.mail");

dbhandler.insertOrUpdate(oUser)
    .then(function (data) {
        console.log(data);
        return dbhandler.fetch("Test", ["test@1mein.mail", "00000"], {
            orderby: [{
                col: "userid",
                order: "ASC"
            }, {
                col: "sUsername",
                order: "DESC"
            }],
            limit: 5,
            offset: 10
        });
    })
    .then(function (data) {
        console.log(data);
        // return dbhandler.fetch("Test", ["kjsda", "asdgsakjdb"], {
        //     orderby: [{
        //         col: "test",
        //         order: "ASC"
        //     }, {
        //         col: "blabla",
        //         order: "DESC"
        //     }],
        //     limit: 10,
        //     offset: 10
        // });
    })
    .catch(function (err) {
        console.log(err);
    });
