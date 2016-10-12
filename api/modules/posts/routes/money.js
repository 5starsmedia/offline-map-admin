'use strict';

var express = require('express'),
    moment = require('moment'),
    _ = require('lodash'),
    async = require('async'),
    tmp = require('tmp'),
    fs = require('fs'),
    fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib'),
    path = require('path'),
    mongoose = require('mongoose'),
  http = require('http'),
    cheerio = require('cheerio'),
    util = require('util'),
    router = express.Router();


router.get('/', function (req, res, next) {
    var options = {
        hostname: 'bank.gov.ua',
        port: 433,
        path: '/NBUStatService/v1/statdirectory/exchange?json',
        method: 'GET'
    };

    var reqA = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            res.json(data);
        });
    });
    reqA.on('error', function(e) {
        res.status(500).end();
    });
    reqA.end();
});

module.exports = router;