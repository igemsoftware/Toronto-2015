/* global console */
'use strict';

angular.module('ConsortiaFlux')

.service('ModelRetriever', ['$http', 'UrlProvider', function($http, UrlProvider) {
    this.type = null;
    this.modelId = null;

    this.getModel = function(cb) {
        $http.get(UrlProvider.baseUrl + '/model/retrieve/' + this.modelId).then(function(res){
            cb(res);
        }, function(err) {
            console.log(err);
        });
    };

    this.getBase = function(cb) {
        this.getModel(function(res) {
            $http.get(UrlProvider.baseUrl + '/' + res.data.file).then(function(res) {
                cb(res.data);
            }, function(err) {
                console.log(err);
            });
        });
    };

    this.getOptimized = function(cb) {
        this.getModel(function(res) {
            $http.get(UrlProvider.baseUrl + '/' + res.data.optimized).then(function(res) {
                cb(res.data);
            }, function(err) {
                console.log(err);
            });
        });
    };
}]);
