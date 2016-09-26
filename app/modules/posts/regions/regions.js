var appName = 'module.posts.regions';

import models from '../models/models.js';

let module = angular.module(appName, [
  'base',
  'ui.router',
  'ngTable',
  'ui.select',
  'ngSanitize',
  'sticky',
  'ng-sortable',
  models
]);

// controllers
import NewsEditCategoryCtrl from './controllers/NewsEditCategoryCtrl.js';
import NewsCategoriesCtrl from './controllers/NewsCategoriesCtrl.js';

module.controller('NewsRegionEditCategoryCtrl', NewsEditCategoryCtrl)
  .controller('NewsRegionCategoriesCtrl', NewsCategoriesCtrl);

var postType = ['page'];

module.config(function ($stateProvider) {
  _.forEach(postType, (type) => {
    $stateProvider
      .state(type + '.regions', {
        url: '/' + type + '-regions',
        controller: 'NewsRegionCategoriesCtrl',
        templateUrl: "views/modules/news/regions/page-list.html",
        data: {
          pageTitle: 'News',
          pageDesc: 'Test',
          hideTitle: true
        },
        resolve: {
          postType: () => type
        }
      })
      .state(type + '.regions.edit', {
        url: "/:id",
        controller: 'NewsRegionEditCategoryCtrl',
        templateUrl: "views/modules/news/regions/page-edit.html",
        data: {
          pageTitle: 'News',
          pageDesc: 'Test',
          hideTitle: true
        },
        resolve: {
          postType: () => type,
          item: function ($stateParams, NewsRegionModel) {
            return NewsRegionModel.get({_id: $stateParams.id}).$promise;
          }
        }
      });
  });
});

export default appName;