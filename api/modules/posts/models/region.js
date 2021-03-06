'use strict';

var mongoose = require('mongoose'),
  materializedPlugin = require('mongoose-materialized');

var schema = new mongoose.Schema({
  id: Number,

  // Назва
  title: {type: String, required: true},
  alias: String,
  parentAlias: String,
  description: String,

  translates: {
    title: {
      ru: String,
      fr: String,
      uk: String,
      en: String,
      je: String
    }
  },

  cssClass: String,
  icon: {type: String, required: true, default: 'grave'},

  createDate: {type: Date, required: true, default: Date.now},

  meta: {
    title: String,
    keywords: String,
    description: String
  },

  coverFile: {
    _id: mongoose.Schema.Types.ObjectId,
    title: String
  },
  files: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      ordinal: Number
    }
  ],

  removed: {type: Date},
  site: {
    _id: mongoose.Schema.Types.ObjectId,
    domain: String
  }
}, {
  strict: true,
  safe: true,
  collection: 'regions'
});

schema.plugin(materializedPlugin);

module.exports = mongoose.model('Region', schema);
