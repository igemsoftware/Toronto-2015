/* global forcelayout */
'use strict';

angular.module('fbaApp')

.controller('LayoutCtrl', ['$scope', '$http', 'UrlProvider', function($scope, $http, UrlProvider) {
    $scope.title = 'Layout component';
    $scope.data = null;

    $scope.draw = function() {
        $http.get(UrlProvider.baseUrl + '/fba/getJSON').success(
            function(jsondata) {
                $scope.data = jsondata;
                //console.log('got json data');
                forcelayout($scope.data);
            });
    };
}]);
