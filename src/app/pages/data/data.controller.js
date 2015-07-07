'use strict';

angular.module('fbaApp')

.controller('DataCtrl', ['$scope', '$http', 'UrlProvider', function($scope, $http, UrlProvider) {
    $scope.title = 'Data page';
}]);
