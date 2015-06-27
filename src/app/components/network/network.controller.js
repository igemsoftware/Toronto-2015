'use strict';

angular.module('fbaApp')


.controller('NetworkCtrl', ['$scope', '$http', '$filter', 'UrlProvider', 'ngTableParams',
        function($scope, $http, $filter, UrlProvider, ngTableParams) {  
    var network = '#network';

    var nodes = [
        {id: 'a', name: 'A', selflink: false},
        {id: 'b', name: 'B', selflink: true},
        {id: 'c', name: 'C', selflink: false},
        {id: "d", name: 'D', selflink: false},
        {id: 'e', name: 'E', selflink: false}
    ];


    // ==== Network Class ====
    Network.getInstance(network, $(network).width(), $(network).height(), nodes);

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
    }

    $scope.lockControl = function() {
        $scope.locked = !$scope.locked;

        if (!$scope.locked) {
            Network.changeDim($('body').width(), $(network).height());
        } else { 
            Network.changeDim($('body').width() - sidebarWidth, $(network).height());
        }
    }
    $scope.lockControl();

    $scope.expandSidebar = function() {
        $(sidebar).width($('body').width() - sidebarOffset);
        $scope.deflated = false;
    }

    $scope.deflateSidebar = function() {
        $(sidebar).width(sidebarWidth);
        $scope.deflated = true;
    }

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
            })     
         }
     }); 
    // ==== End sidebar ====

    
        
    // for later 
    var dataRequest = $http.get('http://45.55.193.224/toydata.json');
    dataRequest.success(function(data) {
        console.log(data);
    }).error(function(err) {
        alert(err);
    }); 
}]);
