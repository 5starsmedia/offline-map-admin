'use strict';

var express = require('express'),
    router = express.Router(),
  request = require("request");


router.get('/', function (req, res, next) {

    var url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            res.json(body) // Print the json response
        }
    })
});

module.exports = router;