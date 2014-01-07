'use strict';

angular.module('form')
  .controller('FormController', ['$rootScope', '$location', 'allAggregateDefinitions', '$q', 'spinner',
    function ($rootScope, $location, allAggregateDefinitions, $q, spinner) {
      var scope = $rootScope.formScope;

      spinner.forPromise(allAggregateDefinitions.get("default")).then(
        function (definition) {
          var aggregateDefinition = new AggregateDefinition(definition);
          scope.aggregate = aggregateDefinition.getAggregate();
        }
      );
    }]);