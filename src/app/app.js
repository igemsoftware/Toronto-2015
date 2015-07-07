'use strict';

angular.module('fbaApp', ['ui.router', 'lumx', 'ngTable'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('main', {
        templateUrl: 'app/templates/main.html'
    })
    .state('main.home', {
        url: '/',
        templateUrl: 'app/pages/home/home.html',
        controller: 'HomeCtrl'
    })
    .state('main.species', {
        url: '/species',
        templateUrl: 'app/pages/species/species.html',
        controller: 'SpeciesCtrl'
    })
    .state('main.getData', {
        url: '/fba',
        templateUrl: 'app/pages/data/data.html',
        controller: 'DataCtrl'
    });
})

.controller('BodyCtrl', ['$scope', function($scope) {
    $scope.title = 'iGEM UofT Computational Biology';
}]);
