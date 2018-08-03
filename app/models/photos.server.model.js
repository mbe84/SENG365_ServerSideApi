const db = require('../../config/db.js');
const fs = require('fs');

//Todo check for authentication and if the auction actually exists. also x-authorization
exports.addphoto = function (photo, token, done) {
     db.get_pool().query("SELECT * FROM photo JOIN auction ON photo.photo_auctionid = auction.auction_id JOIN auction_user ON auction_user.user_id = auction_userid where auction.usertoken = ? AND photo.photo_auctionid = ?  ", [photo, token], function(err, result01){
        db.get_pool().query("INSERT INTO photo (photo_auctionid, photo_image_URI) VALUES ?", [[[Number(photo), photo + '.png']]], function(err, result0){
            if(err) return done(400); //400
            return done(201);
        });
    })
};


exports.getphoto = function (photo1, done) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    db.get_pool().query('SELECT * from photo WHERE photo_auctionid = ?', photo1, function(err, result1) {
        fs.readFile('./photos/' + photo1 + '.png', function(err, result){
            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            if(err) fs.readFile('./photos/' + photo1 + '.jpeg', function(err, result){
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                if(err){
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    fs.readFile('./photos/default.png', function(err, result) {
                        if(result[0] === undefined) return done([200, result]);
                        if(err) return done([500, result]);
                        else {
                            return done([200, result]);
                        }
                    });
                }
                else { return done([200, result])};

            });
            else {
                console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiii');
                return done([200, result]
                )};
        })
    })
};

exports.deletephoto = function (photo1, token, done) {
    db.get_pool().query("SELECT * FROM photo JOIN auction ON photo.photo_auctionid = auction.auction_id JOIN auction_user ON auction_user.user_id = auction_userid where auction.usertoken = ? AND photo.photo_auctionid = ?  ", [photo, token] ,function(err, result01){
        if(err){
            return done(201);
        }
        console.log('///////////');
        db.get_pool().query("DELETE FROM photo where photo_auctionid = ?", [photo1], function(err, result0) {
            if (err) return done(201);
            return done(201);
        })
        console.log("oedmlamsdpzdponasdonzoixdoaosdqsd");
    })
};