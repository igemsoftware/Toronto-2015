'use strict';

angular.module('fbaApp')

.controller('NetworkCtrl', ['$scope', '$http', function($scope, $http) {

    var dataRequest = $http.get('http://45.55.193.224/toydata.json');


    dataRequest.success(function(data) {
        var data = data.data; 

        doShit();

        var nodes = [
            {id: "a", name: "A", selflink: false},
            {id: "b", name: "B", selflink: true},
            {id: "c", name: "C", selflink: false},
            {id: "d", name: "D", selflink: false},
            {id: "e", name: "E", selflink: false}
        ];

        console.log(data);

        var view = '#network';

        var w = $(view).width();
        var h = $(view).height();

        var svg = d3.select(view).append('svg').attr('width', w).attr('height', h);

        var force = d3.layout.force()
            .size([w, h])
            .nodes(nodes)
            .charge(-100)
            .start();

        var node = svg.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 20)
            .style('fill', 'red')
            .call(force.drag);

        force.on('tick', function() {
            node.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
        })

    }).error(function(err) {
        alert(err);
    }); 
}]);
