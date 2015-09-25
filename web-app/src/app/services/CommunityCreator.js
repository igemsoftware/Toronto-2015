/* global console */
'use strict';

angular.module('ConsortiaFlux')

.service('CommunityCreator', ['$http', 'UrlProvider', function($http, UrlProvider) {
    this.modelId = null;

    this.create = function(models, cb) {
        $http.post(UrlProvider.baseUrl + '/community/create', models).then((function(res){

            this.modelId = res.data.id;

            $http.get(UrlProvider.baseUrl + '/' + res.data.file).then(function(res) {
                cb(res.data);
            }, function(err) {
                console.log(err);
            });

        }).bind(this), function(err) {
            console.log(err);
        });
    };

    this.optimize = function(cb) {
        $http.get(UrlProvider.baseUrl + '/community/optimize/' + this.modelId).then((function(res) {

            $http.get(UrlProvider.baseUrl + '/' + res.data).then(function(res) {
                cb(res.data);
            }, function(err) {
                console.log(err);
            });

        }).bind(this), function(err) {
            console.log(err);
        });
    };
}]);
