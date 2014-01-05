var formModule = angular.module('form', ['ngRoute', 'infrastructure']);
formModule.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/form',
    {
      templateUrl: 'modules/form/views/form.html',
      controller: 'FormController'
    });
  $routeProvider.otherwise({redirectTo: '/form'});
}]);

formModule.run(['$rootScope', function ($rootScope) {
  $rootScope.formScope = $rootScope.$new();
}]);