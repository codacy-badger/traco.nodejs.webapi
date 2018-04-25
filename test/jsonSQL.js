var jsonSQL = require("../module/jsonSQL");
var JsonTable = jsonSQL.JsonTable;

var table = new jsonSQL.JsonTable(["id", "name", "text"]);
table.setCols(["id", "name", "text1", "text2"]);
table.addCol("text3");
console.log(table);

table.dropCol("text3");
console.log(table);

var row = table.getRowset();
console.log(row);

for (var i = 0; i < 10; i += 1) {
    row = table.getRowset();
    row.id = i;
    // console.log(row)
    table.insert(row);
}
table.dropCol("text2");
table.addCol("text20", "1 tolles text");
console.log(table);

var table2 = table.copy();
table.dropTable();
console.log(table);

var row1 = table2.getRowset();
row1.id = 22;
var row2 = table2.getRowset();
row2.id = 112;
var row3 = table2.getRowset();
row3.id = 1654;
table2.insert(row1)
    .insert(row2)
    .insert(row3);

var aData = [];
for (var i = 50; i < 60; i += 1) {
    row = table2.getRowset();
    row.id = i;
    // console.log(row)
    aData.push(row);
}
table2.insertMulti(aData);
console.log(table2);

var table3 = new JsonTable(aData);
console.log(table3);

console.log(table2);
console.log(table2.unique("text20"));

for (var i = 0; i < 10; i += 1) {
    row = table2.getRowset();
    row.name = i;
    // console.log(row)
    table2.insert(row);
}
table2.orderBy([{
    col: "text20",
    order: "desc"
}, {
    col: "id",
    order: "asc"
}]);
table2.select({
    col: "text20",
    op: "!==",
    param: null
});
console.log(table2);
// table2.select();
console.log(table2.getData());
table2.set("name", "non");
table2.select({
        col: "name",
        op: "===",
        param: null
    })
    .set("text1", "hehe");
console.log(table2.index);
table2.orderBy([{
    col: "text20",
    order: "asc"
    }, {
    col: "id",
    order: "asc"
}]);
console.log(table2.getData());
console.log(table2.unique("text20"));
table2.select();

table = new JsonTable([
    {"id": "hehe", "text": "some"},
    {"id": null, "text": "other"}
]);

var tFin = table2.join(table, {
    colnames: ["id", "name", "text"],
    coltable1: ["id", "name"],
    coltable2: ["text"],
    oOpt: {
        col1: "text1",
        col2: "id"
    }
});
console.log(tFin);

tFin.select({
    col: "name",
    op: "===",
    param: null
});
console.log(tFin);
tFin.delete();

console.log(tFin);
