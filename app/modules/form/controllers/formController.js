'use strict';

angular.module('form')
  .controller('FormController', ['$rootScope', '$location', 'allAggregateDefinitions', '$q', 'spinner',
    function ($rootScope, $location, allAggregateDefinitions, $q, spinner) {
      var scope = $rootScope.formScope;

      spinner.forPromise(allAggregateDefinitions.get("default")).then(
        function (model) {
          var aggregateModel, modelNavigator;
          aggregateModel = new AggregateModel(model);
          modelNavigator = new ModelNavigator(aggregateModel);

          scope.modelNavigator = modelNavigator;
//          alert(JSON.stringify(scope.modelNavigator));
        }
      );
    }]);