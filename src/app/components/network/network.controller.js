'use strict';

angular.module('fbaApp')


.controller('NetworkCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {  
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
    }

    $scope.deflateSidebar = function() {
        $(sidebar).width(sidebarWidth);
    } 
    // ==== End sidebar ====

    
        
    // for later 
    var dataRequest = $http.get('http://45.55.193.224/toydata.json');
    dataRequest.success(function(data) {
        console.log(data);
    }).error(function(err) {
        alert(err);
    }); 
}]);
