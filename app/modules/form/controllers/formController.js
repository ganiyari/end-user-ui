'use strict';

angular.module('ganiyari')
  .controller('FormController', ['$scope', '$location', 'appService', '$q', 'sessionService', 'spinner', '$window', function ($scope, $location, appService, $q, sessionService, spinner, $window) {
    $scope.openApp = function (appName) {
      $window.location = "/" + appName;
    }

    $scope.appExtensions = [];

    var loadAppExtensions = function () {
      return appService.loadAppExtensions('home');
    }

    var initialize = function () {
      var deferrable = $q.defer();
      sessionService.loadCredentials().then(loadAppExtensions).then(
        function () {
          deferrable.resolve();
        },
        function () {
          deferrable.reject();
        }
      );
      return deferrable.promise;
    };

    spinner.forPromise(initialize()).then(
      function () {
        $scope.appExtensions = appService.allowedApps("org.bahmni.home.form");
      }
    );
  }]);