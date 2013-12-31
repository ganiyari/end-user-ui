'use strict';

var appModule = angular.module('ganiyari', ['form']);
appModule.run(['$rootScope', '$templateCache', function ($rootScope, $templateCache) {
  //Disable caching view template partials
  $rootScope.$on('$viewContentLoaded', function () {
      $templateCache.removeAll();
    }
  )
}]);