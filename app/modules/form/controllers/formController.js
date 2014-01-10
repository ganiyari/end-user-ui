'use strict';

angular.module('form')
  .controller('FormController', ['$rootScope', '$location', 'allAggregateDefinitions', '$q', 'spinner',
    function ($rootScope, $location, allAggregateDefinitions, $q, spinner) {
      var scope = $rootScope.formScope;

      spinner.forPromise(allAggregateDefinitions.get("default")).then(
        function (definition) {
          scope.aggregateDefinition = new AggregateDefinition(definition);
          scope.factDefinition = scope.aggregateDefinition.getAggregate();
          scope.aggregate = scope.factDefinition.newInstance();
          alert(JSON.stringify(scope.aggregateDefinition));
        }
      );
    }]);