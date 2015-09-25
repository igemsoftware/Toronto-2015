/* global console */
'use strict';

angular.module('ConsortiaFlux')

.service('CommunityCreator', ['$http', 'UrlProvider', function($http, UrlProvider) {
    this.create = function(models, cb) {
        $http.post(UrlProvider.baseUrl + '/community/create', models).then(function(res){

            var id = res.data.id;

            $http.get(UrlProvider.baseUrl + '/' + res.data.file).then(function(res) {
                cb(res.data);
            }, function(err) {
                console.log(err);
            });

        }, function(err) {
            console.log(err);
        });
    };
}]);
