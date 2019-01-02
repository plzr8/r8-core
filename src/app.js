"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./helper/database");
var verify_1 = require("./helper/verify");
var user_1 = require("./api/user");
var post_1 = require("./api/post");
var rating_1 = require("./api/rating");
var express = require("express");
var app = express();
var port = 3000;
var postHandler = new post_1.default(app);
var ratingHandler = new rating_1.default(app);
var userHandler = new user_1.default(app);
var database = new database_1.default();
app.get('/', function (req, res) { return res.send('Hello World!'); });
app.use('/api', function (req, res) {
    var accessApi = false;
    var id = req.headers['id'];
    var secret = req.headers['secret'];
    verify_1.isKeyValid(database, id, secret)
        .then(function (isValid) { return accessApi = isValid; })
        .catch(function () { return console.log("Request sent with invalid and/or no API key"); });
    if (!accessApi) {
        res.send({ error: "Invalid API Key!" });
    }
});
app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
