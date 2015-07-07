'use strict';

angular.module('fbaApp')

.controller('DataCtrl', ['$scope', '$http', 'UrlProvider', function($scope, $http, UrlProvider) {
    $scope.title = 'Data page';
    $scope.data = '';

    $http.get(UrlProvider.baseUrl + '/fba/getSBML').success(function(jsondata){
        console.log(jsondata)
        window.fba = jsondata;
        $scope.data = jsondata
    });



}]);
