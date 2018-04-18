var dbhandler = require("../dbhandler");
var classes = require("../classes");

var oUser = new classes.User();

oUser.set.sEmail("test@1mein.mail");

dbhandler.insertOrUpdate(oUser)
    .then(function (data) {
        console.log(data);
        return dbhandler.fetch("Test", ["test@1mein.mail", "00000"]);
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    });
