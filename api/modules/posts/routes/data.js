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
                website: page.website,
                description: page.teaser,
                icon: page.icon,
                type: 'page',
                content: [],
                translates: page.translates
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
                    html: (page.address) ? '<strong>Адрес</strong>: ' + page.address : ''
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

function fillNearPlaces(list)
{
    var places = _.filter(list, function(item) {
        return !!item.coordinates;
    });
    console.info(places);
    _.each(places, function(item) {
        var distances = [];

        _.each(places, function(place) {
            if (place.id == item.id) {
                return;
            }
            distances.push({
                id: place.id,
                distance: getDistance(item, place)
            });
        });
        distances = _.take(_.sortBy(distances, 'distance'), 5);

        item.content.push({
            type: "places",
            items: _.pluck(distances, 'id')
        });
    });
}

function getDistance(place1, place2)
{
    function calcCrow(lat1, lon1, lat2, lon2)
    {
        var R = 6371; // km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lon2-lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value)
    {
        return Value * Math.PI / 180;
    }

    return calcCrow(
        place1.coordinates[0],
        place1.coordinates[1],
        place2.coordinates[0],
        place2.coordinates[1]
    );
}

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
                id: category._id,
                translates: category.translates
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
            fillNearPlaces(result);
            res.json(result);
        });
    });

});

module.exports = router;