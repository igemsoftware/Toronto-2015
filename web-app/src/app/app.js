'use strict';

angular.module('ConsortiaFlux', ['ui.router', 'ngTable', '720kb.tooltips', 'angularModalService', 'ui.bootstrap'])

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
        .state('main.flux', {
            url: '/flux',
            templateUrl: 'app/pages/flux/flux.html',
            //controller: 'FluxCtrl'
        });
})

.controller('BodyCtrl', ['$scope', function($scope) {
    $scope.title = 'iGEM UofT Computational Biology';
}]);
