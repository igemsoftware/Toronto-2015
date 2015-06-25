'use strict';

angular.module('fbaApp')

.controller('NetworkCtrl', ['$scope', '$http', function($scope, $http) { 
    
    // ==== Network Class ====
    

    var nodes = [
        {id: 'a', name: 'A', selflink: false},
        {id: 'b', name: 'B', selflink: true},
        {id: 'c', name: 'C', selflink: false},
        {id: "d", name: 'D', selflink: false},
        {id: 'e', name: 'E', selflink: false}
    ];

    Network.getInstance('#network', nodes); 
        
    // for later 
    var dataRequest = $http.get('http://45.55.193.224/toydata.json');
    dataRequest.success(function(data) {
        console.log(data);
    }).error(function(err) {
        alert(err);
    }); 
}]);
