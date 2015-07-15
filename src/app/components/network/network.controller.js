/* global window */
/* global Network */
/* global alert */
'use strict';

angular.module('fbaApp')


.controller('NetworkCtrl', ['$scope', '$http', '$filter', 'UrlProvider', 'ngTableParams',
        function($scope, $http, $filter, UrlProvider, ngTableParams) {

    var attrs = {
        divName: '#network',
        svg: {
            height: window.innerHeight - 60,
            width: window.innerWidth - 200,
            top: 60
        }
    };

    // ==== Network Class ====
    //create new network
    var network = new Network(attrs);

    var dataRequest = $http.get('http://45.55.193.224/iJO1366.json');
    dataRequest.success(function(data) {
        console.log(data.data[0])
        network.addSystem(data.data[0]);
    }).error(function(err) {
        alert(err);
    });

    // for visualizing on ecoli model
    /*
    $http.get(UrlProvider.baseUrl + '/fba/getJSON').success(function(jsondata){
        console.log('got the data')
        network.addSystem(jsondata);
    });*/


    // ==== Sidebar ====
    var sidebar = '#sidebar';
    var sidebarWidth = $(sidebar).width();
    var sidebarOffset = 100;
    $scope.rippleColour = 'deep-purple-500';
    $scope.locked = true;
    $scope.deflated = true;
    $scope.species = {};

    $scope.getLockedClass = function() {
        if ($scope.locked) {
            return 'locked';
        } else {
            return 'unlocked';
        }
    };

    /*$scope.lockControl = function() {
        $scope.locked = !$scope.locked;

        if (!$scope.locked) {
           network.changeDimensions($('body').width(), $(network).height());
        } else {
          network.changeDimensions($('body').width() - sidebarWidth, $(network).height());
        }
    }*/
  //  $scope.lockControl();

    $scope.expandSidebar = function() {
        $(sidebar).width($('body').width() - sidebarOffset);
        $scope.deflated = false;
    };

    $scope.deflateSidebar = function() {
        $(sidebar).width(sidebarWidth);
        $scope.deflated = true;
    };

    /* jshint newcap: false */
    $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 10,          // count per page
         sorting: {
             DOMAIN: 'asc'     // initial sorting
         }
     }, {
         total: $scope.species.length, // length of data
         getData: function($defer, params) {
            $http.get(UrlProvider.baseUrl + '/species/retrieve/all').success(function(speciesData){
                $scope.species = speciesData;
                var orderedData = params.sorting() ? $filter('orderBy')(speciesData, params.orderBy()) : speciesData;
                params.total(speciesData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }).error(function(err) {
                $defer.reject(err);
            });
         }
     });
    // ==== End sidebar ====

}]);
