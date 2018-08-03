const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: 'mysql3.csse.canterbury.ac.nz',
        user: "mbe84",
        password: "11030423",
        database: "mbe84",
        multipleStatements: true,
        forever : false
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};