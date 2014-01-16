'use strict';

angular.module('form')
  .controller('FormController', ['$rootScope', 'allAggregateDefinitions', '$q', 'spinner',
    function ($rootScope, allAggregateDefinitions, $q, spinner) {
      var scope = $rootScope.formScope;

      spinner.forPromise(allAggregateDefinitions.get("default")).then(
        function (model) {
          var aggregateModel = new AggregateModel(model);
          var rootFact = aggregateModel.getAggregate().newInstance();
          scope.aggregateModel = aggregateModel;
          scope.aggregate = rootFact;
        }
      );

      scope.save = function () {
        console.log(JSON.stringify(scope.aggregate));
      };

      scope.addChildFact = function (factName) {
        var factDefinition = scope.aggregateModel.getFactDefinition(factName);
        scope.aggregate.addChildFact(factDefinition);
      };
    }]);