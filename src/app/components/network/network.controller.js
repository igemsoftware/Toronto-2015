/* global window */
/* global Network */
/* global alert */
'use strict';

angular.module('fbaApp')


.controller('NetworkCtrl', ['$scope', '$http', '$filter', 'UrlProvider', 'ngTableParams',
        function($scope, $http, $filter, UrlProvider, ngTableParams) {

    var attrs = {
        divName: '#network',
        canvas: {
            height: window.innerHeight - 60,
            width: window.innerWidth - 200,
            top: 60
        }
    };

    // ==== Network Class ====
    //create new network
    var network = new Network(attrs);

    var data = {
                  "species": "Escherichia coli",
                  "strain": "MG1655",
                  "id": "1",
                  "genes": [],
                  "metabolites": [{
                                    "id": "10fthf_c",
                                    "name": "Formyltetrahydrofolate",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -2,
                                    "_bound": 0,
                                    "formula": "C20H21N7O7",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "12dgr120_c",
                                    "name": "1,2-Diacyl-sn-glycerol (didodecanoyl, n-C12:0)",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -2,
                                    "_bound": 0,
                                    "formula": "C27H52O5",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "4crsol_c",
                                    "name": "p-Cresol",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": 0,
                                    "_bound": 0,
                                    "formula": "C7H8O",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "5drib_c",
                                    "name": "5'-deoxyribose",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": 0,
                                    "_bound": 0.0,
                                    "formula": "C5H10O4",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "2agpg141_c",
                                    "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1)",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -1,
                                    "_bound": 0.0,
                                    "formula": "C20H38O9P1",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "2agpg141_p",
                                    "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1)",
                                    "compartment": "p",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -1,
                                    "_bound": 0.0,
                                    "formula": "C20H38O9P1",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "coa_c",
                                    "name": "Coenzyme A",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -4,
                                    "_bound": 0.0,
                                    "formula": "C21H32N7O16P3S",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "glu_DASH_L_c",
                                    "name": "L-Glutamate",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -1,
                                    "_bound": 0.0,
                                    "formula": "C5H8NO4",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "accoa_c",
                                    "name": "Acetyl-CoA",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -4,
                                    "_bound": 0.0,
                                    "formula": "C23H34N7O17P3S",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "h_c",
                                    "name": "H+",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": 1,
                                    "_bound": 0.0,
                                    "formula": "H",
                                    "annotation": {}
                                  },
                                  {
                                    "id": "1_acglu_c",
                                    "name": "N-Acetyl-L-glutamate",
                                    "compartment": "c",
                                    "notes": {},
                                    "_constraint_sense": "E",
                                    "charge": -2,
                                    "_bound": 0.0,
                                    "formula": "C7H9NO5",
                                    "annotation": {}
                                  }],
                  "notes": [],
                  "reactions": [{
                                  "id": "DM_4CRSOL",
                                  "metabolites": {"4crsol_c": -1},
                                  "name": "Sink needed to allow p-Cresol to leave system",
                                  "upper_bound": 1000,
                                  "notes": {},
                                  "subsystem": "",
                                  "flux_value": 0.0002190689142381304,
                                  "variable_kind": "countinuous",
                                  "lower_bound": 0,
                                  "gene_reaction_rule": "",
                                  "objective_coefficient":0
                                },
                                {
                                  "id": "DM_5DRIB",
                                  "metabolites": {"5drib_c": -1},
                                  "name": "Sink needed to allow 5'-deoxyribose to leave system",
                                  "upper_bound": 1000,
                                  "notes": {},
                                  "subsystem": "",
                                  "flux_value": 0.00022103365786358447,
                                  "variable_kind": "countinuous",
                                  "lower_bound": 0,
                                  "gene_reaction_rule": "",
                                  "objective_coefficient": 0
                                },
                                {
                                  "id": "2AGPG141tipp",
                                  "metabolites": {"2agpg141_p": -1.0, "2agpg141_c": 1.0},
                                  "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1) transporter via facilitated diffusion (periplasm)",
                                  "upper_bound": 1000.0,
                                  "notes": {},
                                  "subsystem": "Transport, Inner Membrane",
                                  "variable_kind": "continuous",
                                  "lower_bound": 0.0,
                                  "gene_reaction_rule": "",
                                  "objective_coefficient": 0.0,
                                  "flux_value": 0
                                },
                                {
                                  "id": "ACGS",
                                  "metabolites": {"coa_c": 1.0, "glu_DASH_L_c": -1.0, "accoa_c": -1.0, "h_c": 1.0, "1_acglu_c": 1.0},
                                  "name": "N-acetylglutamate synthase",
                                  "upper_bound": 1000.0,
                                  "notes": {},
                                  "subsystem": "Arginine and Proline Metabolism", "variable_kind": "continuous",
                                  "lower_bound": 0.0,
                                  "gene_reaction_rule": "",
                                  "objective_coefficient": 0.0,
                                  "flux_value": 0.29057772323015724
                                }]
               }
      network.addSystem(data);
    /*var dataRequest = $http.get('http://45.55.193.224/toydata.json');
    dataRequest.success(function(data) {
        network.addSystem(data.data[0]);
    }).error(function(err) {
        alert(err);
    });*/

    // for visualizing on ecoli model
    /*
    $http.get(UrlProvider.baseUrl + '/fba/getJSON').success(function(jsondata){
        console.log('got the data')
        network.addSystem(jsondata);
    });*/


    // ==== Sidebar ====
    var sidebar = '#sidebar';
    var sidebarWidth = $(sidebar).width();
    var sidebarOffset = 100;
    $scope.rippleColour = 'deep-purple-500';
    $scope.locked = true;
    $scope.deflated = true;
    $scope.species = {};

    $scope.getLockedClass = function() {
        if ($scope.locked) {
            return 'locked';
        } else {
            return 'unlocked';
        }
    };

    /*$scope.lockControl = function() {
        $scope.locked = !$scope.locked;

        if (!$scope.locked) {
           network.changeDimensions($('body').width(), $(network).height());
        } else {
          network.changeDimensions($('body').width() - sidebarWidth, $(network).height());
        }
    }*/
  //  $scope.lockControl();

    $scope.expandSidebar = function() {
        $(sidebar).width($('body').width() - sidebarOffset);
        $scope.deflated = false;
    };

    $scope.deflateSidebar = function() {
        $(sidebar).width(sidebarWidth);
        $scope.deflated = true;
    };

    /* jshint newcap: false */
    $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 10,          // count per page
         sorting: {
             DOMAIN: 'asc'     // initial sorting
         }
     }, {
         total: $scope.species.length, // length of data
         getData: function($defer, params) {
            $http.get(UrlProvider.baseUrl + '/species/retrieve/all').success(function(speciesData){
                $scope.species = speciesData;
                var orderedData = params.sorting() ? $filter('orderBy')(speciesData, params.orderBy()) : speciesData;
                params.total(speciesData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }).error(function(err) {
                $defer.reject(err);
            });
         }
     });
    // ==== End sidebar ====

}]);
