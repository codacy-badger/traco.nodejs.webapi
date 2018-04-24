var jsonSQL = require("../module/jsonSQL2");
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