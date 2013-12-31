'use strict';

angular.module('form')
  .controller('FormController', ['rootScope', '$location', 'allAggregateModels', '$q', 'spinner',
    function ($rootScope, $location, allAggregateModels, $q, spinner) {
      var scope = $rootScope.$new();

      spinner.forPromise(allAggregateModels.get("default")).then(
        function (definition) {
          scope.currentAppDefinition = definition;
        }
      );
    }]);