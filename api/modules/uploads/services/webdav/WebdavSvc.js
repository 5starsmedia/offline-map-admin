'use strict';

var url = require('url'),
  crypto = require('crypto'),
  mongoose = require('mongoose');

var jsDAV = require("jsDAV/lib/jsdav");
var jsDAVLocksBackendFS = require("jsDAV/lib/DAV/plugins/locks/fs");
var jsDAVFile = require("jsDAV/lib/DAV/file");
var jsDAVCollection = require("jsDAV/lib/DAV/collection");
var jsExceptions = require("jsDAV/lib/shared/exceptions");

var jsDAV_Tree_MongoDB = require("./backend/tree");


var jsDAV_Auth_Backend_AbstractDigest = require("jsDAV/lib/DAV/plugins/auth/abstractDigest");

/**
 * This is an authentication backend that uses a mongo database to manage passwords.
 */
var jsDAV_Auth_Backend_Mongo = module.exports = jsDAV_Auth_Backend_AbstractDigest.extend({
  initialize: function (authBackend, tableName) {
    jsDAV_Auth_Backend_AbstractDigest.initialize.call(this);
    this.authBackend = authBackend;
    this.tableName = tableName || "webdavUsers"
  },

  /**
   * Returns a users' information
   *
   * @param  {string} realm
   * @param  {string} username
   * @return {string}
   */
  getDigestHash: function (realm, username, next) {
    this.authBackend.collection(this.tableName).findOne({
      username: username
    }, function(err, doc) {
      if (err)
        return next(err);

console.info(doc);
      next(null, doc && doc.password);
    });
  }
});

function WebdavSvc(app) {
  this.app = app;
}

WebdavSvc.prototype.start = function () {
  var host = this.app.config.get('webdav.ip'),
    port = this.app.config.get('webdav.port');

  var options = {
    tree: jsDAV_Tree_MongoDB.new(this.app),
    authBackend:  jsDAV_Auth_Backend_Mongo.new(mongoose.connection.db),
    locksBackend: jsDAVLocksBackendFS.new(),
    realm: "paphos"
  };
  //jsDAV.debugMode = true;
  jsDAV.createServer(options, port, host);

  this.app.log.info('WebDav Server started at ' + host + ':' + port);
};

module.exports = WebdavSvc;
