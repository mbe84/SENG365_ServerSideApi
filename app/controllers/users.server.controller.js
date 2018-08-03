const Users = require('../models/users.server.model');

// {
//     "username": "Matthew",
//     "givenName": "string1",
//     "familyName": "string2",
//     "email": "user@example.com",
//     "password": "string3"
// }
exports.create = function(req, res){
    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password

    };

    var username = user_data['username'];
    var givenName = user_data['givenName'];
    var familyName = user_data['familyName'];
    var email = user_data['email'];
    var password = user_data['password'];

    let user = [[[username, givenName, familyName, email, password]]];
    if(user[0][0][4] == '' || user[0][0][4] == null){
        res.status(400).json();
    }
     else if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ) {
        Users.create(user, function (result) {
            if (result === 400) res.status(400).json("Malformed request");
            else {
                if(result == 500){ res.status(500).json("Internal server error"); }
                else {res.status(201).json({"id": result}) }
            }
        });
    } else {
        res.status(400).json("Malformed request")
    }
};

exports.login = function(req, res){
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;

    let user = [username, email, password];
    if(username === null) {
        Users.login1(user, function(result){
            if(result == 400) res.status(400).json();
            else if(result == 500) res.status(500).json();
            else{res.json({ "id" : result[0],
                "token" : result[1]});;}
        });
    } else {
        Users.login2(user, function(result){
            if(result == 400) res.status(400).json();
            else if(result == 500) res.status(500).json();
            else{res.json({ "id" : result[0],
                "token" : result[1]});;}
        });
    }
};

exports.logout = function(req, res){
    let token = req.header("X-Authorization");
    let usedToken = [token];

    Users.logout(usedToken,function (result) {
        if(result === 401) res.status(401).json();
        else if(result === 500) res.status(500).json();
        else{res.status(200).json();}
    });
};

exports.get = function(req, res) {
    let token = req.header("X-Authorization");
    if(token === '' || token === undefined){
        res.status(401).json();
        console.log('hello');
    }
    else {
        let id = req.params.id;
        let used = [id, token] //, token];
        Users.get(used, function(result){
            // if(err){
            //     res.status(404).json();
            //  }
            if(result === 404) res.status(404).json(), console.log("404");
            else if(result === 500) res.status(500).json() , console.log("500");
            else{res.status(200).json(result), console.log("200")}
        });
    }
};

exports.change = function(req, res) {
    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password

    };

    let id = req.params.id;
    var token = req.header("X-Authorization");
    var username = user_data['username'];
    var givenName = user_data['givenName'];
    var familyName = user_data['familyName'];
    var email = user_data['email'];
    var password = user_data['password'];

    let user = [[[id, username, givenName, familyName, email, password, token]]];
     Users.change(user, function(result){
         if(result === 401)  res.status(401).json();
         else if(result === 500)  res.status(500).json()
         else{res.status(201).json();};
     });
};