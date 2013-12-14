'use strict';

angular
  .module('ganiyari', ['http-auth-interceptor', 'httpErrorInterceptor', 'infrastructure', 'ngCookies'])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/login',
      {
        templateUrl: 'modules/auth/views/login.html',
        controller: 'LoginController'
      });
    $routeProvider.when('/dashboard',
      {
        templateUrl: 'modules/dashboard/views/dashboard.html',
        controller: 'DashboardController'
      });
    $routeProvider.otherwise({redirectTo: '/dashboard'});
  }]).run(function ($rootScope, $templateCache) {
    //Disable caching view template partials
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
      }
    )
  });
