const database = require('../models/database.server.model');


exports.reset = function (req, res) {
    database.reset(function (result) {
        if(result === 500) res.status(500).json();
        else if(result === 400) res.status(400).json();
        else {res.status(200).json(); }
    });
};

exports.resample = function (req, res) {
    database.resample(function (result) {
        if(result === 500) res.status(500).json();
        else if(result === 400) res.status(400).json();
        else {res.status(201).json(); }
    });
};