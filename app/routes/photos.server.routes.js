const photos = require('../controllers/photos.server.controller');

module.exports = function(app){
    app.route('/api/v1/auctions/:id/photos')
        .post(photos.addphoto)
        .get(photos.getphoto)
        .delete(photos.deletephoto);
};