import posts from './posts/posts';
import categories from './categories/categories';
import regions from './regions/regions';

import editorSelectImages from './ckeditor_plugins/selectImage/plugin.js';

var appName = 'module.posts';

var module = angular.module(appName, [
  editorSelectImages,
  posts,
  categories,
  regions
]);

import mediaembed from './ckeditor_plugins/mediaembed/plugin.js';
import more from './ckeditor_plugins/more.js';
import ad from './ckeditor_plugins/ad.js';
import link from './ckeditor_plugins/link.js';

export default appName; 