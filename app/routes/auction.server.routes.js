const auction = require('../controllers/auction.server.controller');

module.exports = function(app){
    app.route('/api/v1/auctions')
        .get(auction.viewAll)
        .post(auction.create)

    app.route('/api/v1/auctions/:id')
        .get(auction.viewDetails)
        .patch(auction.change)

    app.route('/api/v1/auctions/:id/bids')
        .post(auction.bid)
        .get(auction.viewHistory)
};