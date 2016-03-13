export default
/*@ngInject*/
function bzLocalizable($compile, $rootScope) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: true,
    link: function (scope, element, attrs) {

      scope.$watch(attrs.ngModel, function (value) {
        if (angular.isObject(value) || $rootScope.current.language != 'ru') {
          return;
        }
        if (value === null) {
          return;
        }
        console.info(value)
        scope.$eval(attrs.bzLocalizable + '=$value', {$value: value});
      });
    }
  };
}