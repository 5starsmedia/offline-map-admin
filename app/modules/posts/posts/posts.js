var appName = 'module.news.post';

import models from '../models/models.js';

let module = angular.module(appName, [
  'base',
  'ui.bootstrap.popover',
  'ui.router',
  'satellizer',
  'ngTable',
  'ngCkeditor',
  'ui.select',
  'ngSanitize',
  'sticky',
  'uiGmapgoogle-maps',
  models
]);

// controllers
import NewsPostsCtrl from './controllers/NewsPostsCtrl.js';
import NewsPostsEditCtrl from './controllers/NewsPostsEditCtrl.js';

module.controller('NewsPostsCtrl', NewsPostsCtrl)
  .controller('NewsPostsEditCtrl', NewsPostsEditCtrl);

var postType = ['page'];

// config
module.config(function ($stateProvider, basePermissionsSetProvider) {
  _.forEach(postType, (type) => {

    $stateProvider
      .state(type, {
        abstract: true,
        parent: 'cabinet',
        template: '<div ui-view></div>',
        resolve: {
          permissions: basePermissionsSetProvider.access([])
        }
      })
      .state(type + '.posts', {
        url: '/' + type,
        controller: 'NewsPostsCtrl',
        templateUrl: "views/modules/news/page-posts.html",
        data: {
          pageTitle: 'News',
          pageDesc: 'Test',
          hideTitle: true
        },
        resolve: {
          postType: () => type,
          permissions: basePermissionsSetProvider.access([])
        }
      })
      .state(type + '.create', {
        url: '/' + type + '/new',
        controller: 'NewsPostsEditCtrl',
        templateUrl: "views/modules/news/page-edit.html",
        data: {
          pageTitle: 'News',
          pageDesc: 'Test',
          hideTitle: true
        },
        resolve: {
          postType: () => type,
          post: ($stateParams, $q, NewsPostModel, $auth) => {
            var defer = $q.defer();
            var date = new Date();
            date.setHours(date.getHours() + (date.getMinutes() < 50 ? 1 : 2));
            date.setMinutes(0);
            date.setSeconds(0);

            var payload = $auth.getPayload();
            defer.resolve(new NewsPostModel({
              title: {},
              isAllowComments: true,
              postType: type,
              ownPhoto: false,
              template: 'sidebar',
              icon: 'grave',
              pageType: 'page',
              location: {},
              account: {
                _id: payload._id
              },
              status: 4,
              publishedDate: date
            }));
            return defer.promise;
          }
        }
      })
      .state(type + '.edit', {
        url: '/' + type + '/:id',
        controller: 'NewsPostsEditCtrl',
        templateUrl: "views/modules/news/page-edit.html",
        data: {
          pageTitle: 'News',
          pageDesc: 'Test',
          hideTitle: true
        },
        resolve: {
          postType: () => type,
          post: function($stateParams, NewsPostModel) {
            return NewsPostModel.get({ _id: $stateParams.id }).$promise;
          }
        }
      })

  });
});

export default appName;