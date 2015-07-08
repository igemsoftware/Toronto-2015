'use strict';

angular.module('fbaApp')


.controller('NetworkCtrl', ['$scope', '$http', '$filter', 'UrlProvider', 'ngTableParams',
        function($scope, $http, $filter, UrlProvider, ngTableParams) {
    var divName = '#network';

    // ==== Network Class ====
    var network = new Network(divName,  {
                  height: window.innerHeight - 60,
                  width: window.innerWidth - 200,
                  top: 60
                });

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


    // for now
    var dataRequest = $http.get('http://45.55.193.224/toydata.json');




    dataRequest.success(function(data) {
      network.addSpecie(data.data[0]);
      network.addSpecie(data.data[1]);
    }).error(function(err) {
        alert(err);
    });
}]);
