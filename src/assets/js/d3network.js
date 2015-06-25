var Network = (function() {
    var instance = null;
    
    function Network() {
        this.view = '';
        this.w = null;
        this.h = null;
        this.svg = null;
        this.node = null;
        this.nodes = [
             {id: "a", name: "A", selflink: false},
             {id: "b", name: "B", selflink: true},
             {id: "c", name: "C", selflink: false},
             {id: "d", name: "D", selflink: false},
             {id: "e", name: "E", selflink: false}
        ];
        this.force = null;
    }


    function getInstance(divName) {
        if (!instance) {
            instance = new Network();
            instance.view = divName;
            instance.w = $(instance.view).width();
            instance.h = $(instance.view).height(); 
        }

        return instance;
    }

    function createSvg() {
        instance.svg = d3
            .select(instance.view)
            .append('svg')
            .attr('width', instance.w)
            .attr('height', instance.h);

        instance.force = d3.layout.force()
             .size([instance.w, instance.h])
             .nodes(instance.nodes)
             .charge(-100)
             .start();

        instance.node = instance.svg.selectAll('.node')
             .data(instance.nodes)
             .enter().append('circle')
             .attr('class', 'node')
             .attr('r', 20)
             .style('fill', 'red')
             .call(instance.force.drag);

        instance.force.on('tick', function() {
             instance.node
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
        })
    }


    return {
        getInstance: function(divName) {
            getInstance(divName);
            createSvg();
        }
    };
})();
