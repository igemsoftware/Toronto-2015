'use strict';

angular.module('fbaApp')

.controller('NetworkCtrl', ['$scope', '$http', function($scope, $http) { 
    
    // ==== Network Class ====
    Network.getInstance('#network'); 
        
    // for later 
    var dataRequest = $http.get('http://45.55.193.224/toydata.json');
    dataRequest.success(function(data) {
        console.log(data);
    }).error(function(err) {
        alert(err);
    }); 
}]);
