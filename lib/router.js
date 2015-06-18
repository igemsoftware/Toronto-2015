var fs   = require('fs');
var path = require('path');

var routesDir = path.resolve('routes');
var validRouteFile = 'index.js';

function endpointer (rPath) {
    // remove everything up to and including '/route'
    rPath = rPath.replace(routesDir, '');
    
    // take off filename
    return rPath.slice(0, rPath.length - 'index.js'.length - 1);
}

function findRoutes (rPath, app) {
    var dirs = fs.readdirSync(path.resolve(rPath));

    dirs.forEach(function(dir) {
        var fullPath = path.resolve(rPath, dir);

        if (fs.statSync(fullPath).isDirectory()) {
            // recurse if we have not ended up at a file yet
            findRoutes(fullPath, app);
        } else {
            var fileName = fullPath.split('/')[fullPath.split('/').length - 1];

            if (fileName === 'index.js') {
                console.log(endpointer(fullPath));
                app.use(endpointer(fullPath), require(fullPath));
            }
        }
    });
}


module.exports = {
    init: function(app) {
        findRoutes(routesDir, app);

        app.get('/', function(req, res) {
            res.send('got a GET request at root\n');
        });

        app.post('/', function(req, res) {
            res.send('got a POST request at root, req.body:\n' +
                req.body);
        });
    }
};
