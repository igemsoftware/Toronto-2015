/* global window */
/* global Network */
/* global alert */
/* global console */
'use strict';

angular.module('HyperFlux')


.controller('NetworkCtrl', ['$scope', '$http', '$filter', 'UrlProvider', 'ngTableParams',
        function($scope, $http, $filter, UrlProvider, ngTableParams) {

        console.log('Activating NetworkCtrl');


    /* jshint newcap: false */
    // $scope.tableParams = new ngTableParams({
    //      page: 1,            // show first page
    //      count: 10,          // count per page
    //      sorting: {
    //          DOMAIN: 'asc'     // initial sorting
    //      }
    //  }, {
    //      total: $scope.species.length, // length of data
    //      getData: function($defer, params) {
    //         $http.get(UrlProvider.baseUrl + '/species/retrieve/all').success(function(speciesData){
    //             $scope.species = speciesData;
    //             var orderedData = params.sorting() ? $filter('orderBy')(speciesData, params.orderBy()) : speciesData;
    //             params.total(speciesData.length);
    //             $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    //         }).error(function(err) {
    //             $defer.reject(err);
    //         });
    //      }
    //  });
}]);
