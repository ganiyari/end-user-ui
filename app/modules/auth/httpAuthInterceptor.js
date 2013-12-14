// Inspired by code from https://github.com/witoldsz/angular-http-auth

'use strict';

angular.module('http-auth-interceptor', [])
  .config(function ($httpProvider) {
    var interceptor = ['$rootScope', '$q', function ($rootScope, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        if (response.status === 401) {
          $rootScope.$broadcast('event:auth-loginRequired');
        }
        return $q.reject(response);
      }

      return function (promise) {
        return promise.then(success, error);
      }

    }];
    $httpProvider.responseInterceptors.push(interceptor);
  }).run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('event:auth-loginRequired', function () {
      $rootScope.errorMessage = "You are not authenticated right now. Please login."
      $location.path("/login");
    })
  }]);