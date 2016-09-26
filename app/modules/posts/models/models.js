var appName = 'module.news.models';

var module = angular.module(appName, [
  'ngResource',
  'ngEditableTree'
]);

// models
import NewsPostModel from './NewsPostModel.js';
import NewsCategoryModel from './NewsCategoryModel.js';
import NewsRegionModel from './NewsRegionModel.js';

module
  .factory('NewsPostModel', NewsPostModel)
  .factory('NewsCategoryModel', NewsCategoryModel)
  .factory('NewsRegionModel', NewsRegionModel)
;

export default appName;