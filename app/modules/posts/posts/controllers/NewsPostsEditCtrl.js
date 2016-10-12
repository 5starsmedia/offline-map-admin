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

    /*
     db.posts.find({ _id: ObjectId('574d9e7a9286b438235f00c5') });

     db.collection('posts').update(
     { _id: ObjectId('574d9e7a9286b438235f00c5') },
     {
     $set: { "cuisine": "American (New)" },
     $currentDate: { "lastModified": true }
     }, function(err, results) {
     console.log(results);
     callback();

     });

     db.posts.find({ }).forEach(function (content) {
     var region = {};

     content.address = content.address || '';
      var regTitle = 'Винницкая о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c75e37ded9480c61deab'), title: regTitle + 'бласть' };
     }
     regTitle = 'Волынская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c75337ded9480c61dea1'), title: regTitle + 'бласть' };
     }
     regTitle = 'Днепропетровская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c74837ded9480c61de97'), title: regTitle + 'бласть' };
     }
     regTitle = 'Донецкая о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c73d37ded9480c61de8d'), title: regTitle + 'бласть' };
     }
     regTitle = 'Житомирская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c72f37ded9480c61de83'), title: regTitle + 'бласть' };
     }
     regTitle = 'Закарпатская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c71c37ded9480c61de78'), title: regTitle + 'бласть' };
     }
     regTitle = 'Запорожская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c71937ded9480c61de6f'), title: regTitle + 'бласть' };
     }
     regTitle = 'Ивано-Франковская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c70d37ded9480c61de60'), title: regTitle + 'бласть' };
     }
     regTitle = 'Киевская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c70237ded9480c61de56'), title: regTitle + 'бласть' };
     }
     regTitle = 'Кировоградская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6f737ded9480c61de4c'), title: regTitle + 'бласть' };
     }
     regTitle = 'Луганская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6ec37ded9480c61de42'), title: regTitle + 'бласть' };
     }
     regTitle = 'Львовская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6e237ded9480c61de38'), title: regTitle + 'бласть' };
     }
     regTitle = 'Николаевская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6d837ded9480c61de2e'), title: regTitle + 'бласть' };
     }
     regTitle = 'Одесская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6ce37ded9480c61de24'), title: regTitle + 'бласть' };
     }
     regTitle = 'Полтавская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6c037ded9480c61de1a'), title: regTitle + 'бласть' };
     }
     regTitle = 'Ровненская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6b437ded9480c61de10'), title: regTitle + 'бласть' };
     }
     regTitle = 'Сумская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c6a637ded9480c61de06'), title: regTitle + 'бласть' };
     }
     regTitle = 'Тернопольская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c69737ded9480c61ddfc'), title: regTitle + 'бласть' };
     }
     regTitle = 'Харьковская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c68c37ded9480c61ddf2'), title: regTitle + 'бласть' };
     }
     regTitle = 'Хмельницкая о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c68037ded9480c61dde8'), title: regTitle + 'бласть' };
     }
     regTitle = 'Черкасская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c67537ded9480c61ddde'), title: regTitle + 'бласть' };
     }
     regTitle = 'Черниговская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c66a37ded9480c61ddd4'), title: regTitle + 'бласть' };
     }
     regTitle = 'Черновицкая о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c65e37ded9480c61ddca'), title: regTitle + 'бласть' };
     }
     regTitle = 'Херсонская о';
     if (content.address.indexOf(regTitle) !== -1 || (content.category2 && content.category2.title.indexOf(regTitle) !== -1)) {
      region = { _id: ObjectId('57e8c64d37ded9480c61ddbf'), title: regTitle + 'бласть' };
     }
     db.posts.update({ _id: content._id }, { $set: { 'region': region } });
     printjson(region);

     });

     db.posts.find({ $and: [{'category2.title': { $exists: false }}, {'category2._id': { $exists: true }}] }).forEach(function (content) {
     db.categories.find({ _id: content.category2._id }).forEach(function (content2) {
     db.posts.update({ _id: content._id }, { $set: { 'category2.title': content2.title } });
     });
     });
     */

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