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

function strRepeat(s, n) {
    st = '';
    for (var i = 0; i < n; i++) {
        st += s;
    }
    return st;
}

var colorize = {
    GET: 'blue',
    POST: 'magenta',
    MW: 'cyan'
};

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
                var endpoint = endpointer(fullPath);
                var endpointRouter = require(fullPath);

                if (endpointRouter.routes) {
                    endpointRouter.routes.forEach(function(route) {
                        var routeLog = '  → '.yellow + route.method[colorize[route.method]] + strRepeat(' ', 8 - route.method.length) + endpoint.green;
                        if (route.route !== '/')
                            routeLog += route.route.green;
                        console.log(routeLog);
                    });
                } else {
                    var mws = '';
                    endpointRouter.middleware.forEach(function(mw, index) {
                        index > 0  ? mws += ', ' + mw.cyan : mws += mw.cyan; 
                    })
                    var routeLog = '  ↝ '.yellow + 'MW'[colorize['MW']] + strRepeat(' ', 8 - 'MW'.length) +  endpoint.green + '/**/*'.green + ' ⇢ '.yellow + mws;
                    console.log(routeLog);
                } 
                app.use(endpoint, endpointRouter.router);
            }
        }
    });
}


module.exports = {
    init: function(app) {
        console.log('==== Setting up routes and middlewares ===='.italic);
        findRoutes(routesDir, app);
        console.log('==== All routes and middlewares initialized ===='.italic);
    }
};
