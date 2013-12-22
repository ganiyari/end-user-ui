'use strict';

angular
  .module('ganiyari', ['http-auth-interceptor', 'httpErrorInterceptor', 'infrastructure', 'ngCookies'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login',
      {
        templateUrl: 'modules/auth/views/login.html',
        controller: 'LoginController'
      });
    $routeProvider.when('/form',
      {
        templateUrl: 'modules/form/views/form.html',
        controller: 'DashboardController'
      });
    $routeProvider.otherwise({redirectTo: '/form'});
  }])
  .run(function ($rootScope, $templateCache) {
    //Disable caching view template partials
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
      }
    )
  });
