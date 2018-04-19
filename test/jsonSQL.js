"use strict";
var jsonSQL = require("../module/jsonSQL");
console.log(jsonSQL);

console.log("-----------------------------------------");
console.log("-----------       BEGIN       -----------");
console.log("-----------------------------------------");

var aData1 = [
    {"id": "00", "text": "Hallo", "pID": "AA"},
    {"id": "01", "text": "Hello", "pID": "BB"},
    {"id": "02", "text": "Olla", "pID": "BB"},
    {"id": "03", "text": "meme", "pID": "AA"},
    {"id": "04", "text": "trululu", "pID": "AA"}
];
var data1db = new jsonSQL.JsonDB(aData1);
var aData2 = [
    {"id": "AA", "name": "Proj1"},
    {"id": "BB", "name": "Proj2"}
];
var data2db = new jsonSQL.JsonDB(aData2);
// data1db.createIndex("text");
// console.log(data1db);
// data1db.dropCol("text");
console.log(data1db);
console.log(data2db);

data1db.orderBy(["pID"], ["ASC"]);

// data1db.find({
//     col:"pID",
//     op: "!==",
//     param: "AA"
// });
console.log(data1db);
// console.log(data1db.where({
//     col: "pID",
//     op: "!==",
//     param: "AA"
// }));


// var dataJoin = data1db.join({
//     db: data2db,
//     join: "id->pID",
//     cols: [["id", "text"], ["name"]]
// });

// console.log(dataJoin);

console.log("-----------------------------------------");
console.log("-----------        END        -----------");
console.log("-----------------------------------------");