export default
class NewsPostsEditCtrl {

  /*@ngInject*/
  constructor($scope, $state, $filter, NewsRegionModel, post, notify, NewsCategoryModel, $http, $sce, postType, uiGmapIsReady) {

    var markerId = 1;

    $scope.postType = postType;

    post.sections = post.sections || [];
    var oldStatus = post.status;
    post.location = post.location || {};
    $scope.post = post;

    NewsCategoryModel.getTree({ postType: postType, page: 1, perPage: 100 }, (data) => {
      $scope.categories = data;
    });
    NewsRegionModel.getTree({ page: 1, perPage: 100 }, (data) => {
      $scope.regions = data;
    });

    $scope.control = {};
    uiGmapIsReady.promise().then(function (maps) {
      if($scope.control.refresh) $scope.control.refresh();
    });
    $scope.$watch('post.pageType', () => {
      if($scope.control.refresh) {
        $scope.$evalAsync(() => {
          $scope.control.refresh();
        });
      }
    })

    $scope.map = {
      center: {
        latitude: post.location.lat || 50.43826,
        longitude: post.location.lng || 30.52413
      },
      zoom: 14,
      events: {
        click: function(mapModel, eventName, originalEventArgs) {
          var e;
          e = originalEventArgs[0];
          $scope.setMarkerPos(Math.random(), e.latLng);
          return $scope.$apply();
        }
      }
    };

    $scope.onKeyDown = (address, e) => {
      if (e.keyCode == 13 && address) {
        e.stopPropagation();
        //e.preventDefault();
        $scope.onAddressChange(address);
        return false;
      }
    }

    $scope.onAddressChange = function(address) {
      $scope.loading = true;
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        'address': address,
        region: 'ru',
        language: 'ru'
      }, function(places, status) {
        return $scope.$apply(function() {
          $scope.loading = false;
          if (places && places.length) {
            var place = places[0];
            if (!place.geometry || !place.geometry.location) {
              return;
            }
            return $scope.setMarkerPos(place.place_id, place.geometry.location, true);
          }
        });
      });
    };

    $scope.marker = {
      key: markerId,
      id: markerId++,
      coords: {
        latitude: post.location.lat,
        longitude: post.location.lng
      },
      options: {
        draggable: true
      },
      events: {
        dragend: function(marker, eventName, args) {
          post.location.lat = marker.getPosition().lat();
          post.location.lng = marker.getPosition().lng();
        }
      }
    };

    $scope.setMarkerPos = function(id, pos, boundsSet) {
      var bounds;
      bounds = new google.maps.LatLngBounds();
      post.location.lat = pos.lat();
      post.location.lng = pos.lng();
      $scope.marker = {
        key: markerId,
        id: markerId++,
        coords: {
          latitude: pos.lat(),
          longitude: pos.lng()
        },
        options: {
          draggable: true
        },
        events: {
          dragend: function(marker, eventName, args) {
            post.location.lat = marker.getPosition().lat();
            post.location.lng = marker.getPosition().lng();
          }
        }
      };
      bounds.extend(pos);
      if (!boundsSet) {
        return;
      }
      return $scope.map.bounds = {
        northeast: {
          latitude: bounds.getNorthEast().lat(),
          longitude: bounds.getNorthEast().lng()
        },
        southwest: {
          latitude: bounds.getSouthWest().lat(),
          longitude: bounds.getSouthWest().lng()
        }
      };
    };

    $scope.saveItem = (item) => {
      $scope.loading = true;
      let save = item._id ? item.$save : item.$create;
      delete item.viewsCount;
      delete item.commentsCount;

      if (!item.coverFile) {
        item.coverFile = _.first(item.files)
      }
      if (oldStatus != item.status && item.status == 4) {
        oldStatus = item.status;
        item.publishedDate = new Date();
        item.createDate = new Date();
        console.info(item);
      }
      save.call(item, (data) => {
        $scope.loading = false;
        //$state.go('news.posts');
        notify({
          message: $filter('translate')('Article saved!'),
          classes: 'alert-success'
        });
        $state.go('^.edit', { id: data._id });
      }, (res) => {
        $scope.loading = false;
        $scope.error = res.data;
      });
    };
    $scope.saveItemPartial = (model) => {
      var item = angular.copy(model);

      if (item.status != 1) {
        return;
      }
      let save = item._id ? item.$save : item.$create;
      delete item.viewsCount;
      delete item.commentsCount;
      save.call(item, (data) => {
        notify({
          message: $filter('translate')('Auto saved!'),
          classes: 'alert-success'
        });
        $scope.post._id = data._id;
        $scope.autosaved = new Date();
      });
    };

    $scope.tags = [];
    $scope.loadTags = function (x) {
      if (x == '') {
        $scope.tags = [];
        return;
      }
      $http.get('/api/posts/tags-complete?term=' + encodeURIComponent(x)).success(function (data) {
        $scope.tags = data;
      });
    };
    $scope.toTag = function (text) {
      var item = {
        title: text
      };
      return item;
    };
    $scope.trustAsHtml = function(value) {
      return $sce.trustAsHtml(value);
    };
    $scope.deleteSection = function(item) {
      $scope.post.sections = _.without($scope.post.sections, item);
    };



    $scope.sources = [];
    $scope.loadSources = function (x) {
      if (x == '') {
        $scope.sources = [];
        return;
      }
      $http.get('/api/posts/source-complete?term=' + encodeURIComponent(x)).success(function (data) {
        $scope.sources = data;
      });
    };
    $scope.selectSource = (item, model) => {
      $scope.post.source = item.title;
    };

    $scope.countWords = (str) => {
      return (str || '').split(/\s+/).length;
    };

    $scope.editorOptions = {
      language: 'ru',
      extraPlugins: 'SelectImages,mediaembed,adInsert,showblocks,codesnippet',
      removePlugins: 'image,forms,youtube,autogrow,image2',
      allowedContent: true,
      removeDialogTabs: 'image:advanced;link:advanced',
      toolbar: [
        { name: 'controls', items: [ 'Undo', 'Redo' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'insert', items: [ 'Image', 'SelectImages', 'Table', 'HorizontalRule' ] },
        { name: 'special', items: [ 'Maximize', 'Source' ] },
        '/',
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
        { name: 'styles', items: [ 'Format', 'FontSize', 'RemoveFormat' ] },
        //{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'forms', items: [ 'Outdent', 'Indent', 'ShowBlocks'  ] }
      ],
      height: 450
    };


    // forms

    $scope.showSettings = false;
    $scope.hideSettings = () => {
      $scope.showSettings = false;
    };
    $scope.$on('fbChangeActive', (e, component) => {
      $scope.editedItem = component;
      $scope.showSettings = !!component;
    });
    $scope.$on('fbRemoveComponent', (e, component) => {
      $scope.post.sections = _.reject($scope.post.sections, component.object)
    });
  }
}