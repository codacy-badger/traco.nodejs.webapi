var dbhandler = require("../dbhandler");
var classes = require("../classes");

var oUser = new classes.User();

oUser.set.sEmail("test@1mein.mail");

dbhandler.insertOrUpdate(oUser)
    .then(function (data) {
        console.log(data);
        return dbhandler.fetch("Test", ["test@1mein.mail", "00000"], {
            limit: 5,
            offset: 10
        });
    })
    .then(function (data) {
        console.log(data);
        // return dbhandler.fetch("Test", ["kjsda"], {
        //     orderby: [{
        //         col: "test",
        //         order: "ASC"
        //     }],
        //     limit: 10,
        //     offset: 10
        // })
    })
    .catch(function (err) {
        console.log(err);
    });
