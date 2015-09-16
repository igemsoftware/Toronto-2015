'use strict';

angular.module('HyperFlux', ['ui.router', 'ngTable'])

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
    });
})

.controller('BodyCtrl', ['$scope', function($scope) {
    $scope.title = 'iGEM UofT Computational Biology';
}]);
