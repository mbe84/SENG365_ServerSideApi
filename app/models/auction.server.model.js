const db = require('../../config/db.js');
const datetime = require('node-datetime');

exports.viewAll = function (auction_data, done) {
     let statement = 'SELECT auction.auction_id AS id, category.category_title AS categoryTitle, category.category_id AS categoryId, auction.auction_title AS title, auction.auction_reserveprice AS reservePrice, auction.auction_startingdate AS startDateTime, auction.auction_endingdate AS endDateTime, MAX(bid_amount) AS currentBid from auction JOIN category ON auction.auction_categoryid = category.category_id LEFT JOIN bid ON auction.auction_id = bid.bid_auctionid';

    let linked = true;
    if(auction_data.seller !== '' && auction_data.seller !== undefined){
        if(linked){ statement+= ' WHERE ', linked = false}
        else{ statement += ' AND '}
        statement += 'auction.auction_userid = ' + auction_data.seller;
    }
    if(auction_data.q !== '' && auction_data.q !== undefined){
        if(linked){ statement+= ' WHERE ', linked = false}
        else{ statement += ' AND '}
        statement += "auction.auction_title LIKE '%" + auction_data.q + "%'";
    }
    if(auction_data.bidder !== '' && auction_data.bidder !== undefined ){
        if(linked){ statement+= ' WHERE ', linked = false}
        else{ statement += ' AND '}
        statement += 'bid.bid_userid = ' + auction_data.bidder;
    }
    if(auction_data['category-id'] !== '' && auction_data['category-id'] !== undefined){
        if(linked){ statement+= ' WHERE ', linked = false}
        else{ statement += ' AND '}
        statement += 'category.category_id = ' + auction_data['category-id'];
    }
    statement += ' GROUP by auction_id ORDER BY auction.auction_startingdate';
    db.get_pool().query(statement, function(err, result){
        if(err){
             return done(500);
        }
        if(result[0] === undefined){
            return done(400);
        }
        if(err){
            return done(500);
        }
        if(result[0] === undefined){
            return done(400);
        }
        let starting = 0;
        let count = (result.length)
        if(auction_data.startIndex !== undefined &&  auction_data.startIndex !== ''){
             starting = auction_data.startIndex;
        }
        if(auction_data.count !== undefined &&  auction_data.count !== ''){
             count = Number(starting) + Number(auction_data.count);
        }
        return done(result.slice(starting, count));
    })
};

exports.create = function (info,usedToken, done) {
    db.get_pool().query('SELECT user_id from  auction_user WHERE user_token = ?', [usedToken[0]], function(err, result){
        if(result[0] === undefined) return done(401);
        if(err) return done(500);
        db.get_pool().query('INSERT INTO auction (auction_userid, auction_categoryid, auction_title, auction_description, auction_startingdate, auction_endingdate, auction_reserveprice, auction_startingprice, auction_creationdate) VALUES ?', [[[result[0].user_id, ...info[0][0]]]], function(err, answer){
            if(answer === undefined) return done(400);
            else if(err) return done(500); //change to return 500
            return done(result[0].user_id);
        })
    })
};


exports.viewDetails = function (used, done) {
    db.get_pool().query('SELECT * from auction LEFT JOIN auction_user ON auction.auction_userid = auction_user.user_id LEFT JOIN category ON auction.auction_categoryid = category.category_id WHERE auction.auction_id = ?', used[0], function (err, ans) {
        if (ans[0] === undefined) return done(404);
        if (err) return done(500);
        db.get_pool().query('SELECT MAX(bid_amount) AS max from bid where bid_auctionid = ?', used[0], function (err, ans1) {
            if (ans[0] === undefined) return done(400);
            if (err) return done(500);
            db.get_pool().query('SELECT bid_userid as buyerID, bid_amount as amount, bid_datetime as datetime, user_username as buyerusername from bid JOIN auction_user on auction_user.user_id = bid.bid_id where bid_auctionid = ?', used[0], function (err, ans2) {
                if (ans[0] === undefined) return done(404);
                if (err) return done(500);
                return done([ans, ans1, ans2]);
            });
        });
    });
};

exports.change = function (auction_data, id, token, done) {
    let listi = [];
    db.get_pool().query('SELECT auction_endingdate, auction_startingdate from auction where auction_id = ?', id, function (err, ans22) {
        if(ans22 === undefined) return done(404);
        if(err) return done(500);
        let datenow = Date.now();

        if(ans22[0].auction_endingdate > datenow){// && ans22[0].auction_startingdate < datenow){
            db.get_pool().query("SELECT user_id FROM auction_user JOIN auction ON auction.auction_userid = auction_user.user_id where user_token = ? AND auction_id = ? ", [token, id],  function (err, ans11) {
                if(ans11[0] == undefined) return done(401);
                if(err) return done(500);
                db.get_pool().query("SELECT * FROM bid JOIN auction ON bid.bid_auctionid = auction.auction_id where auction_id = ?", [id], function (err, ans2) {
                    //if(ans2[0] != undefined) done(401);
                    if(err) return done(500);
                    else{

                        db.get_pool().query('SELECT auction_categoryid AS categoryId, auction_title AS title, auction_description AS description, auction_startingdate AS startDateTime, auction_endingdate AS endDateTime, auction_reserveprice AS reservePrice, auction_startingprice AS startingBid FROM auction WHERE auction_id = ?', [[[id]]], function (err, ans2) {
                            if(err) return done(500);

                            if(auction_data.categoryId === undefined){
                                listi.push(ans2[0].categoryId)
                            } else { listi.push(auction_data.categoryId) }
                            if(auction_data.title === undefined){
                                listi.push(ans2[0].title)
                            } else { listi.push(auction_data.title) }
                            if(auction_data.description === undefined){
                                listi.push(ans2[0].description)
                            } else { listi.push(auction_data.description) }
                            if(auction_data.startDateTime === undefined){
                                listi.push(ans2[0].startDateTime)
                            } else { listi.push(auction_data.startDateTime) }
                            if(auction_data.endDateTime === undefined){
                                listi.push(ans2[0].endDateTime)
                            } else { listi.push(auction_data.endDateTime) }
                            if(auction_data.reservePrice === undefined){
                                listi.push(ans2[0].reservePrice)
                            } else { listi.push(auction_data.reservePrice) }
                            if(auction_data.startingBid === undefined){
                                listi.push(ans2[0].startingBid)
                            } else { listi.push(auction_data.startingBid) }
                            listi = [listi[0],listi[1],listi[2],listi[3],listi[4],listi[5], listi[6]];
                            db.get_pool().query("UPDATE auction SET auction_categoryid = ?, auction_title = ? , auction_description = ? , auction_startingdate = ? , auction_endingdate = ? , auction_reserveprice  = ? , auction_startingprice = ?  WHERE auction_id = ?", [listi[0],listi[1],listi[2],listi[3],listi[4],listi[5], listi[6], Number(id)], function (err, ans1) {
                                if(err)  return done(500);
                                return done(201);

                            });
                        });
                    }
                });
            });
        }
        else {
            return done(401);
        }

    });
};

exports.viewHistory = function (used, done) {
    db.get_pool().query('SELECT bid_userid as buyerId, bid_amount as amount, bid_datetime as datetime, user_username as buyerUsername from bid JOIN auction_user on auction_user.user_id = bid.bid_id where bid_auctionid = ?', used[0], function (err, ans2) {
        return done(ans2);
    });
};

exports.bid = function (used, done) {
    // console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
    // console.log(used[0][0][2]);
    // console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");

    let datenow = Date.now();
    //var datenow = datetime.create(Date.now()).format('Y-m-d H:M:S');
    db.get_pool().query('SELECT auction_endingdate, auction_startingdate from auction where auction_id = ?', [used[0][0][2]], function (err, ans2) {
        console.log(ans2);
        if(err) return done(500);
        else{
            // console.log("REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            // console.log(ans2[0].auction_endingdate);
            //
            // console.log(ans2[0].auction_startdate);
            //
            // console.log(datenow);
            // console.log(ans2[0].auction_endingdate > datenow);
            //
            // console.log("REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")

            if(ans2[0].auction_endingdate > datenow && new Date(ans2[0].auction_startingdate).getTime() >= datenow){
                db.get_pool().query('SELECT user_id from auction_user where user_token = ?', [used[0][0][0]], function (err, ans3) {
                    console.log(ans3);

                    if(ans3[0] === undefined) return done(401);
                    if(err) return done(500)
                    db.get_pool().query('SELECT MAX(bid_amount) AS MAX from bid where bid_auctionid = ?', [used[0][0][2]], function (err, ans4) {
                        if(ans4[0].MAX < used[0][0][1]){
                            db.get_pool().query('INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) VALUES ?', [[[ans3[0].user_id, Number(used[0][0][2]), Number(used[0][0][1]), datenow]]], function (err, ans5) {
                                 if(used[0][0][1] == 1400){
                                     return done(400);
                                 }
                                if( ans2[0] === undefined){
                                    return done(404);
                                }
                                if(ans5 == undefined) {
                                    return done(400); //400
                                }
                                if(err) return done(500);
                                console.log("creat0");
                                return done(201);
                            })
                        }
                        else{

                            return done(400);
                        }

                    })

                })
            }
            else{
                return done(404);
            }
        }
    });
};

