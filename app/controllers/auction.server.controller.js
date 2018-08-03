const Auction = require('../models/auction.server.model');
const datetime = require('node-datetime');

exports.viewAll = function(req, res){
    let auction_data = {
        "startIndex": req.query.startIndex,
        "count": req.query.count,
        "q": req.query.q,
        "category-id": req.query["category-id"],
        "seller": req.query.seller,
        "bidder": req.query.bidder,
        "winner": req.query.winner
    };
    Auction.viewAll( auction_data, function (result) {
        console.log(result);
        if(result == 400) { res.status(400).json()}
        else if(result == 500) { res.status(500).json()}
        else {
            res.status(200).json(result);
        }
    });
};

exports.create = function(req, res) {
    let user_data = {
        "token" : req.header("X-Authorization")
    };
    let token = user_data['token'];
    let usedToken = [token];
    let auction_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    };

    var categoryId = auction_data['categoryId'];
    var title = auction_data['title'];
    var description = auction_data['description'];
    var startDateTime = new Date(parseInt(auction_data['startDateTime']));
    var endDateTime = new Date(parseInt(auction_data['endDateTime']));
    var reservePrice = auction_data['reservePrice'];
    var startingBid = auction_data['startingBid'];
    var creationTime = datetime.create(Date.now()).format('Y-m-d H:M:S');
    // console.log("100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    // console.log(startDateTime);
    // console.log(endDateTime);
    // console.log("100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");


    let info = [[[categoryId, title, description, startDateTime, endDateTime, reservePrice, startingBid, creationTime]]];

    Auction.create(info, usedToken, function (result) {
        if(result === 500) res.status(500).json();
        else if(result === 401) res.status(401).json();
        else if(result === 400 || auction_data['endDateTime'] == null || auction_data['endDateTime'] == ''|| auction_data['startDateTime'] == null || auction_data['startDateTime'] == '' || auction_data['startDateTime'] >= auction_data['endDateTime'] ) res.status(400).json();
        else{
            res.status(201).json({ "id" : result});
        }
    });
};

exports.viewDetails = function(req, res) {
    let id = req.params.id;
    let used = [id];
    Auction.viewDetails(used, function(result) {
        if(result === 404) {
            res.status(404).json();
        }
         else if(result === 400){
            res.status(400).json();
        }
         else if(result === 500) {
            res.status(500).json();
        }
        else {
            res.status(200).json({
                "categoryID": result[0][0].auction_categoryid,
                "categoryTitle": result[0][0].category_title,
                "title": result[0][0].auction_title,
                "reservePrice": result[0][0].auction_reserveprice,
                "startDateTime": result[0][0].auction_startingdate,
                "endDatetime": result[0][0].auction_endingdate,
                "description": result[0][0].auction_description,
                "creationDateTime": result[0][0].auction_creationdate,
                "seller": {
                    "id": result[0][0].user_id,
                    "username": result[0][0].user_username
                },
                "startingBid": result[0][0].auction_startingprice,
                "currentBid": result[1][0].max,

                "bids" :
                    result[2]
            })
        }
    });
};

exports.change = function(req, res) {
    let auction_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid

    };
    let id = req.params.id;
    let token = req.header("X-Authorization");
    Auction.change(auction_data, id, token, function(result) {
        res.status(result).json(result); //result
    });
};


exports.viewHistory = function(req, res) {
    let id = req.params.id;
    console.log(id);
    let used = [id];
    Auction.viewHistory(used, function (result) {
        if(result === 404) res.status(404).json();
        else{
            res.status(200).json(result);
        }
    });
};

exports.bid = function(req, res) {
    let user_data = {
        "token" : req.header("X-Authorization"),
        "amount" : req.query.amount
    };
    let id = req.params.id;
    let token = user_data['token'];
    let amount = user_data['amount'];
    let info = [[[token, amount, id]]];
    Auction.bid(info, function (result) {
        res.status(result).json();
    });
};
