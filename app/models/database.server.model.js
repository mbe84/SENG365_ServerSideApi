const db = require('../../config/db.js');
const fs = require('fs');
const path = require('path');
const findRemoveSync = require('find-remove');

var resetQuery = fs.readFileSync("./reset.sql", "utf-8");
var resampleQuery = fs.readFileSync("./resample.sql", "utf-8");

exports.reset = function (done) {
    console.log(__dirname + "/../photos");
    findRemoveSync(path.resolve(__dirname + "/../photos"), {
        extensions: ['.png', 'jpeg'],
        ignore: 'default.png'
    });
    db.get_pool().query(resetQuery, function (err, rows) {
        if (err) {
            return done(500);
        }
        if (rows[0] == undefined) {
            return done(400);
        }
        return done(rows);
    });

};

exports.resample = function (done) {
    db.get_pool().query(resampleQuery, function (err, rows) {
        if (err){
            return done(500);
        }
        if (rows[0] == undefined) {
            return done(400);
        }
        console.log(rows);
        return done(rows);
    });
};
