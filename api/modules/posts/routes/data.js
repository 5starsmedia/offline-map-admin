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
    Grid = require('gridfs-stream'),
    cheerio = require('cheerio'),
    util = require('util'),
    router = express.Router();


var addPostForCategory = function(app, category, item, result, next) {
    var params = { $or: [ {'category._id': category._id}, {'category2._id': category._id} ], removed: {$exists: false}, status: 4};
    app.models.posts.find(params, function(err, data) {
        if (err) { return next(err); }

        var ids = [];
        _.each(data, function(page) {
            ids.push(page._id);

            var pageItem = {
                id: page._id,
                alias: 'id-' + page._id,
                title: page.title,
                phone: page.phone,
                description: page.teaser,
                icon: page.icon,
                type: 'page',
                content: []
            };

            if (page.coverFile && page.coverFile._id) {
                pageItem.image = 'http://jew.5stars.link/api/files/' + page.coverFile._id;
            }
            if (page.pageType == 'place') {
                if (page.location.lat) {
                    pageItem.coordinates = [page.location.lat, page.location.lng];
                }
                pageItem.content.push({
                    type: "card-showcase",
                    html: '<strong>Адрес</strong>: ' + page.address
                });
            }

            _.each(page.sections, function(section) {
                var sectionItem =  {
                    type: 'card',
                    title: section.title,
                    html: (section.body || '').replace('src="/api', 'src="http://jew.5stars.link/api')
                };
                pageItem.content.push(sectionItem);
            });

            if (!_.find(result, { id: pageItem.id })) {
                result.push(pageItem);
            }
        });
        item.items = ids;

        result.push(item);

        next();
    });
};

router.get('/', function (req, res, next) {
    async.auto({
        'categories': function (next) {
            var params = { 'site._id': req.site._id, removed: {$exists: false}, path: { $ne: '' } };

            req.app.models.categories.find(params, next)
        }
    }, function (err, data) {
        if (err) { return next(err); }

        var result = [];

        var categoryIds = {};
        async.eachLimit(data.categories, 1, function(category, next) {
            var item = {
                type: 'list',
                icon: category.icon,
                title: category.title,
                alias: 'id-' + category._id,
                id: category._id
            };
            if (category.title == 'Обзор') {
                item.alias = 'browse';
            }
            if (category.title == 'Места') {
                item.alias = 'places';
            }
            if (category.title == 'Синагоги') {
                item.alias = 'synagogues';
            }
            if (category.title == 'Общины') {
                item.alias = 'community';
            }
            if (category.title == 'Жилье') {
                item.alias = 'hostels';
            }
            if (category.title == 'Еда') {
                item.alias = 'food';
            }
            if (category.title == 'Справка') {
                item.alias = 'help';
            }
            if (category.title == 'Туризм') {
                item.alias = 'world';
            }

            categoryIds[category.parentId] = categoryIds[category.parentId] || [];
            categoryIds[category.parentId].push(category._id);

            addPostForCategory(req.app, category, item, result, next);
        }, function() {

            result = _.map(result, function(item) {
                if (item.type == 'list' && categoryIds[item.id]) {
                    item.items = categoryIds[item.id];
                }
                return item;
            });
            res.json(result);
        });
    });

});

module.exports = router;