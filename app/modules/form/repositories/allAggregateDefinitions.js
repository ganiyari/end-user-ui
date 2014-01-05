'use strict';

angular.module('form').service('allAggregateDefinitions', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
  this.get = function (aggregateName) {
    //introduce constant
    var deferred = $q.defer();
    var aggregateURL = aggregateName + ".json";
    $http.get(aggregateURL).success(function (data) {
      deferred.resolve(data);
    }).error(function () {
        deferred.reject('Could not get aggregates for ' + aggregateName);
      });
    return deferred.promise;
  };
}]);