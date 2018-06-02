"use strict";

var fs = require('fs');
var excel = require('exceljs');
var ObjectID = require('mongodb').ObjectID;

var jamia = {
    "_id": ObjectID(),
    "name": "BKZ Klagenfurt",
    "email": "office@bkz-klagenfurt.at",
    "homepage": "www.bkz-klagenfurt.at",
    "address": {
        "street": "Schülerweg 53",
        "postalCode": "9020",
        "city": "Klagenfurt am Wörthersee"
    },
    "admin": [{
        user: ObjectID("59b606600000000000000000"),
        role: "admin"
    }]
};
var users = [];
var transactions = [];
var transactiontypes = [];

var vazifaTypes = ["K1", "K.1", "K-1"];

var workbook = new excel.Workbook();
workbook.xlsx.readFile("bkz-klagenfurt-kassabuch-2017.xlsx")
    .then(function() {
        workbook.eachSheet(function(worksheet) {
            worksheet.eachRow({includeEmpty: false}, function(row) {
                if(worksheet.name == "kassabuch")
                    processKassabuchRow(row);
                else if(worksheet.name == "prilog")
                    processPrilogRow(row);
                else if(worksheet.name == "transactiontypes")
                    processTransactionTypesRow(row);
            });
        });

        fs.writeFile('result/jamias.json', JSON.stringify([jamia], null, 4));
        fs.writeFile('result/users.json', JSON.stringify(users, null, 4));
        fs.writeFile('result/transactiontypes.json', JSON.stringify(transactiontypes, null, 4));
        fs.writeFile('result/transactions.json', JSON.stringify(transactions, null, 4));
    });

function processKassabuchRow(row) {
    try {
        var transactionId = ObjectID();
        var typ = row.getCell(1).value;
        var source = row.getCell(2).value;

        if(typ && typ.toString().indexOf("K") != -1 || source) {
            var description = row.getCell(4).value;
            var date = row.getCell(6).value;
            var incoming = row.getCell(5).value;
            var outgoing = row.getCell(7).value;
            var group = transactiontypes.find(function(s) { return s.key == typ });

            if(incoming && !outgoing && !isNaN(incoming)) {
                var userId = null;
                if(vazifaTypes.indexOf(typ) != -1) {
                    if(description && description.indexOf("Vazifa") != -1) {
                        var name = description.toString().split(" Vazifa")[0];
                        var user = users.find(function(u) {
                            if(name.indexOf(u.name) != -1)
                                return true;
                            var nameParts = u.name.split(" ");
                            if(nameParts.length > 2 && name.indexOf(nameParts[0]) != -1 && name.indexOf(nameParts[1]) != -1)
                                return true;
                            return false;
                        });
                        if(!user) {
                            user = {
                                "_id": ObjectID(),
                                "name": name,
                                "jamia": jamia["_id"],
                                "transactions": []
                            };
                            users.push(user);
                            userId = user["_id"];
                        } else {
                            userId = user["_id"];
                        }
                        user["transactions"].push(transactionId);
                    }
                }

                transactions.push({
                    "_id": transactionId,
                    date: date,
                    transactionType: group ? group["_id"] : null,
                    title: description,
                    amount: Math.abs(incoming),
                    source: source ? source.toString() : null,
                    user: userId,
                    jamia: jamia["_id"]
                });
            } else if(outgoing && !incoming && !isNaN(outgoing)) {
                transactions.push({
                    "_id": transactionId,
                    date: date,
                    transactionType: group ? group["_id"] : null,
                    title: description,
                    amount: Math.abs(outgoing)*(-1),
                    source: source,
                    jamia: jamia["_id"]
                });
            } else if(incoming && outgoing && !isNaN(incoming) && !isNaN(outgoing)) {
                description += "\nUlaz:"+incoming;
                description += "\nIzlaz:"+outgoing;

                transactions.push({
                    "_id": transactionId,
                    date: date,
                    transactionType: group ? group["_id"] : null,
                    title: description,
                    amount: Math.abs(incoming-outgoing),
                    source: source,
                    jamia: jamia["_id"]
                });
            }
        }
    } catch(e) {
        console.error("[ERROR]", e);
    }
}

function processPrilogRow(row) {
    try {
        var typ = row.getCell(1).value;
        var source = row.getCell(2).value;

        if(typ && typ.toString().indexOf("K") != -1 || source) {
            var description = row.getCell(7).value ? row.getCell(7).value+" "+source : source;
            source = row.getCell(4).value;
            var date = row.getCell(3).value;
            var incoming = row.getCell(5).value;
            var outgoing = row.getCell(6).value;

            if(incoming && !outgoing && !isNaN(incoming)) {
                var userId = null;
                var group = transactiontypes.find(function(s) { return s.key == "K-7" });

                var name = description.toString();
                var user = users.find(function(u) {
                    if(name.indexOf(u.name) != -1)
                        return true;
                    var nameParts = u.name.split(" ");
                    if(nameParts.length > 2 && name.indexOf(nameParts[0]) != -1 && name.indexOf(nameParts[1]) != -1)
                        return true;
                    return false;
                });
                if(user) {
                    userId = user["_id"];
                }

                transactions.push({
                    date: date,
                    transactionType: group["_id"],
                    title: description,
                    amount: Math.abs(incoming),
                    source: source ? source.toString() : null,
                    user: userId,
                    jamia: jamia["_id"]
                });
            } else if(outgoing && !incoming && !isNaN(outgoing)) {
                var group = transactiontypes.find(function(s) { return s.key == "K-8" });

                transactions.push({
                    date: date,
                    transactionType: group["_id"],
                    title: description,
                    amount: Math.abs(outgoing)*(-1),
                    source: source,
                    jamia: jamia["_id"]
                });
            } else if(incoming && outgoing && !isNaN(incoming) && !isNaN(outgoing)) {
                description += "\nUlaz:"+incoming;
                description += "\nIzlaz:"+outgoing;

                var group = transactiontypes.find(function(s) { return s.key == "K-8" });

                transactions.push({
                    date: date,
                    transactionType: group["_id"],
                    title: description,
                    amount: Math.abs(incoming-outgoing),
                    source: source,
                    jamia: jamia["_id"]
                });
            }
        }
    } catch(e) {
        console.error("[ERROR]", e);
    }
}

function processTransactionTypesRow(row) {
    try {
        var key = row.getCell(1).value;
        var name = row.getCell(2).value;

        if(key && name) {
            transactiontypes.push({
                "_id": ObjectID(),
                "key": key,
                "name": name,
                "jamia": jamia["_id"]
            });
        }
    } catch(e) {
        console.error("[ERROR]", e);
    }
}