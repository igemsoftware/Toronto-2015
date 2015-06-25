var Network = (function() {
    var instance = null;
    
    function Network() {
        this.view = '';
    }


    function getInstance(divName) {
        if (!instance) {
            instance = new Network();
            instance.view = divName;
        }

        return instance;
    }


    return {
        getInstance: function(divName) {
            getInstance(divName);
        },
        test: function() {
            alert(instance.view);
        }
    };
})();
