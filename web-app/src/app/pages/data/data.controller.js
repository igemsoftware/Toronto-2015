'use strict';

angular.module('HyperFlux')

.controller('DataCtrl', ['$scope', '$http', 'UrlProvider', function($scope, $http, UrlProvider) {
    $scope.title = 'Data page';
}]);
