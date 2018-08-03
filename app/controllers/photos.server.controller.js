const photo = require('../models/photos.server.model');
const fs = require('fs');


exports.addphoto = function(req, res){
    let photo1 = req.params.id;
    let token = req.header("X-Authorization");
    photo.addphoto(photo1, token, function (result) {
        if(result === 201){
            req.pipe(fs.createWriteStream("./photos/" + photo1 + '.png'));
            res.status(201).json(result);
        }
        else{
            res.status(400).json(result);
        }
    });
};

exports.getphoto = function(req, res){
    let photo1 = req.params.id;
    photo.getphoto(photo1, function (result) {
        console.log(result[1]);
        res.status(200).header('Content-Type', "image/png").end(result[1]);
    });
};

exports.deletephoto = function(req, res){
    let photo1 = req.params.id;
    let token = req.header("X-Authorization");
    photo.deletephoto(photo1, token, function (result) {
        console.log("deleting the photo");
        res.status(result).end();
    });
};

