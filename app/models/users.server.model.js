const db = require('../../config/db.js');

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

exports.create = function (user, done) {
    // db.get_pool().query('SELECT user_id from auction_user WHERE user_username = ?', user[0][0][0], function(err, result1) {
    //     if(result1 == undefined) {
    //         console.log(user[0][0][0]);
    //         console.log(result1);
    db.get_pool().query('INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES ?', user, function (err, result) {
        if (err) {
            return done(500);
        }

        if (result === undefined) { //result[0]
            return done(400);
            }
            db.get_pool().query('SELECT user_id from auction_user WHERE(user_username, user_givenname, user_familyname, user_email, user_password) = ?', user, function (err, result2) {
                return done(result2[0].user_id); //[0].user_id);
            })
    });
        // } else {
        //     console.log(result1);
        //     return done(400);
        // }
    //});
};


exports.login1 = function (user, done) {
    let details = [user[1], user[2]];
    db.get_pool().query('SELECT user_id from auction_user WHERE user_email = ? AND user_password = ?', details, function(err, result1) {
        if (err){
            return done(500);
        }
        if (result1[0] === undefined){
            return done(400);
        } else {
            let token1 = token();
            db.get_pool().query('UPDATE auction_user SET user_token = ? where user_id = ?', [[token1],[result1[0].user_id]], function(err, result) {
                return done([result1[0].user_id, token1]);
            });
        }
    });
};

exports.login2 = function (user, done) {
    let details = [user[0], user[2]];
    db.get_pool().query('SELECT user_id from auction_user WHERE user_username = ? AND user_password = ?', details, function(err, result1) {
        if (err) {
            return done(500);
        }
        if (result1[0] === undefined){
            return done(400);
        } else {
            let token1 = token();
            db.get_pool().query('UPDATE auction_user SET user_token = ? where user_id = ?', [[token1 ],[result1[0].user_id]], function(err, result) {
                return done([result1[0].user_id, token1 ]);
            });
        }
    })
};

exports.logout = function (usedToken, done) {
    db.get_pool().query('UPDATE auction_user SET user_token = NULL WHERE user_token = ?', usedToken[0], function(err, result) {
        if (err) {
            return done(500);
        }
        if (result.affectedRows === 0) {
            return done(401);
        }
        return done("200: OK");
    });

};

exports.get = function (used, done) {
    db.get_pool().query('SELECT user_token from auction_user WHERE (user_id) =  ?', used[0], function (err, ans){
        console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");

        if(err){
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            //console.log(err);
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            return done(404);
        }
        if(ans[0].user_token == used[1]){
            console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");

            db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName, user_email AS email, user_accountbalance AS accountBalance FROM auction_user WHERE (user_id) =  ?', used, function (err, rows) {
                if (err) return done(500);
                if (rows[0] == undefined) {
                    return done(404);
                }
                return done(rows[0]);
            })
        } else {
            console.log("22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222");

            db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName FROM auction_user WHERE (user_id) =  ?',
                used, function (err, rows) {
                if (err) return done(500);
                if (rows[0] == undefined) {
                    return done(404);
                }
                console.log("yes");
                return done(rows[0]);
            })
        }
    })
};

exports.change = function (user, done) {
    db.get_pool().query('SELECT user_username from auction_user WHERE user_id = ? AND user_token = ?', [[user[0][0][0]], [user[0][0][6]]], function (err, ans) {
        if (ans === [] || ans[0] == undefined) return done(401);
        else{
            if(user[0][0][1] !== undefined){
                db.get_pool().query('UPDATE auction_user SET user_username = ? WHERE user_id = ?', [[user[0][0][1]], [user[0][0][0]]], function (err, ans) {
                    if (err) return done(500);
                })
            }
            if(user[0][0][2] !== undefined){
                db.get_pool().query('UPDATE auction_user SET user_givenname = ? WHERE user_id = ?', [[user[0][0][2]], [user[0][0][0]]], function (err, ans) {
                    if (err) return done(500);
                })
            }
            if(user[0][0][3] !== undefined){
                db.get_pool().query('UPDATE auction_user SET user_familyname = ? WHERE user_id = ?', [[user[0][0][3]], [user[0][0][0]]], function (err, ans) {
                    if (err) return done(500);
                })
            }
            if(user[0][0][4] !== undefined){
                db.get_pool().query('UPDATE auction_user SET user_email = ? WHERE user_id = ?', [[user[0][0][4]], [user[0][0][0]]], function (err, ans) {
                    if (err) return done(500);
                })
            }
            if(user[0][0][5] !== undefined){
                db.get_pool().query('UPDATE auction_user SET user_password = ? WHERE user_id = ?', [[user[0][0][5]], [user[0][0][0]]], function (err, ans) {
                    if (err) return done(500);
                })
            }
        }
        return done('OK');
    })
};

