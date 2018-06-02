'use strict';

var ObjectID = require('mongodb').ObjectID;

var transactiontypes = require('./data/transactiontypes.json');
var jamias = require('./data/jamias.json');
var transactions = require('./data/transactions.json');
var users = require('./data/users.json');

module.exports.id = "import-bkz-klagenfurt-data";

module.exports.up = function (done) {
    console.log("Up: 'import-bkz-klagenfurt-data'");
    try {
        var transactiontypesCollection = this.db.collection('transactionTypes');
        var jamiasCollection = this.db.collection('jamias');
        var transactionsCollection = this.db.collection('transactions');
        var usersCollection = this.db.collection('users');

        for(var i = 0, l = users.length; i < l; i++) {
            users[i]["_id"] = ObjectID(users[i]["_id"]);
            users[i]["jamia"] = ObjectID(users[i]["jamia"]);
            for(var j = 0, k = users[i]["transactions"].length; j < k; j++)
                users[i]["transactions"][j] = ObjectID(users[i]["transactions"][j]);
        }
        for(var i = 0, l = transactiontypes.length; i < l; i++) {
            transactiontypes[i]["_id"] = ObjectID(transactiontypes[i]["_id"]);
            transactiontypes[i]["jamia"] = ObjectID(transactiontypes[i]["jamia"]);
        }
        for(var i = 0, l = transactions.length; i < l; i++) {
            transactions[i]["_id"] = ObjectID(transactions[i]["_id"]);
            transactions[i]["user"] = ObjectID(transactions[i]["user"]);
            transactions[i]["jamia"] = ObjectID(transactions[i]["jamia"]);
            transactions[i]["transactionType"] = ObjectID(transactions[i]["transactionType"]);
        }
        for(var i = 0, l = jamias.length; i < l; i++) {
            jamias[i]["_id"] = ObjectID(jamias[i]["_id"]);
            for(var j = 0, k = jamias[i]["admin"].length; j < k; j++)
                jamias[i]["admin"][j]["user"] = ObjectID(jamias[i]["admin"][j]["user"]);
        }

        transactiontypesCollection.insertMany(transactiontypes, null, function (err, result) {
            if (err)
                return done(err);

            jamiasCollection.insertMany(jamias, null, function (err, result) {
                if (err)
                    return done(err);

                transactionsCollection.insertMany(transactions, null, function (err, result) {
                    if (err)
                        return done(err);

                    usersCollection.insertMany(users, null, function (err, result) {
                        if (err)
                            return done(err);
                        done();
                    });
                });
            });
        });
    } catch (err) {
        console.log("[ERROR]", err);
        done(err);
    }
};

module.exports.down = function (done) {
    console.log("Down: 'import-bkz-klagenfurt-data'");
    done();
};