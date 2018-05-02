
var helper = require("../helper");
var classes = require("../classes");

var clone3 = function (oObject) {
    if (oObject === null || typeof oObject !== "object") {
        return oObject;
    }
    // var oCopy = oObject.constructor();
    var oCopy = {};
    var aKeys = Object.keys(oObject);
    for (var i = 0; i < aKeys.length; i += 1) {
        if (oObject.hasOwnProperty(aKeys[i])) {
            oCopy[aKeys[i]] = oObject[aKeys[i]];
        }
    }
    return oCopy;
}


var oContact = new classes.Contact();
console.log(oContact);

oContact.set.idGroup("0000");
console.log(oContact);


var copy = clone3(oContact.fields)
oContact.set.idGroup("0021")
console.log(oContact.fields)
console.log(copy);