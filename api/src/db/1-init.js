'use strict';

var ObjectID = require('mongodb').ObjectID;

var users = [
    {
        "_id": ObjectID("59b606600000000000000000"),
        "email": "office@dzemat.at",
        "password": "$2a$06$/3a7VPTTSMu0oBnXSY/lZ..MZyX3j4S1zBnO2QCcuoBgvSdWsXIs6",
        "name": "Ermin Muratovic",
        "admin": true
    }
];

module.exports.id = "init";

module.exports.up = function (done) {
    console.log("Up: 'init'");
    try {
        var usersCollection = this.db.collection('users');

        usersCollection.insertMany(users, null, function (err, result) {
            if (err)
                return done(err);
            done();
        });
    } catch (err) {
        done(err);
    }
};

module.exports.down = function (done) {
    console.log("Down: 'init'");
    done();
};