'use strict';

angular.module('form')
  .controller('FormController', ['$rootScope', '$location', 'allAggregateDefinitions', '$q', 'spinner',
    function ($rootScope, $location, allAggregateDefinitions, $q, spinner) {
      var scope = $rootScope.$new();

      spinner.forPromise(allAggregateDefinitions.get("default")).then(
        function (definition) {
          scope.currentAppDefinition = definition;
        }
      );
    }]);