'use strict';

var _ = require('lodash');

function RedirectsSvc(app) {
    this.app = app;
    this.log = app.log.child({module: 'RedirectsSvc'});
}

RedirectsSvc.prototype.newRedirect = function (urlFrom, urlTo, site, next) {
    next();
};


module.exports = RedirectsSvc;
