/* global console */
'use strict';

angular.module('ConsortiaFlux')

.service('CommunityCreator', ['$http', 'UrlProvider', function($http, UrlProvider) {
    this.modelId = null;

    this.create = function(models, cb) {

        // turn ['iJO1366', 'Mb_iUPDATE'] into ['Mb_iUPDATE', 'iJO1366']
        var tModels = [models.models[1], models.models[0]];
        models.models = tModels;

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
