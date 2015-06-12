'use strict';

angular.module('fbaApp', ['ui.router', 'lumx'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/pages/home/home.html',
            controller: 'HomeCtrl'
        })
        .state('species', {
            url: '/species',
            templateUrl: 'app/pages/species/species.html',
            controller: 'SpeciesCtrl'
        });
})

.controller('BodyCtrl', ['$scope', function($scope) {
    $scope.title = 'iGEM UofT Computational Biology';
}]);
