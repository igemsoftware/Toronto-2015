var fs   = require('fs');
var path = require('path');

var routesDir = path.resolve('routes');
var validRouterFile = 'index.js'

var spacer = 8;
var endpointColour = 'green';
var arrowColour = 'yellow';

function colorize(method) {
    switch (method) {
        case 'GET'  : return 'blue'; break;
        case 'POST' : return 'magenta'; break;
        case 'MW'   : return 'cyan'; break;
        default     : return 'white';
    }
}

function arrowify(method) {
    switch (method) {
        case 'GET'  : return '→ '; break;
        case 'POST' : return '⇴ '; break;
        case 'PUT'  : return '⇴ '; break;
        case 'MW'   : return '↝ '; break;
        default     : return '→ ';
    }
}

function pathmaker (rPath) {
    // remove everything up to and including '/route'
    rPath = rPath.replace(routesDir, '');
    
    // take off filename
    rPathArray = rPath.split('/');
    rPath = '';
    for (var i = 0; i < rPathArray.length - 1; i++) {
        i > 0 ? rPath += '/' + rPathArray[i] : rPath += rPathArray[i];
    }
    return rPath; 
}

function routerLogger (r, endpoint) {
    if (r.route) { 
        var method = r.route.stack[0].method.toUpperCase();
        
        var routeLog = '  ' + arrowify(method)[arrowColour]; 
        routeLog += method[colorize(method)] + strRepeat(' ', spacer - method.length) + endpoint[endpointColour];
        if (r.route.path !== '/') {
            routeLog += r.route.path[endpointColour];
        }
        console.log(routeLog);
    } else {
        var middlewareLog = '  ' + arrowify('MW')[arrowColour];
        middlewareLog += 'MW'[colorize('MW')] + strRepeat(' ', spacer - 'MW'.length);
        middlewareLog += endpoint[endpointColour] + '/**/*'[endpointColour] + ' ⇢ '[arrowColour];
        middlewareLog += r.name.cyan;
        console.log(middlewareLog);
    }
}

function strRepeat(s, n) {
    st = '';
    for (var i = 0; i < n; i++) {
        st += s;
    }
    return st;
}


function findRouters (rPath, app) {
    var dirs = fs.readdirSync(path.resolve(rPath));

    dirs.forEach(function(dir) {
        var fullPath = path.resolve(rPath, dir);

        if (fs.statSync(fullPath).isDirectory()) {
            // recurse if we have not ended up at a file yet
            findRouters(fullPath, app);
        } else {
            var fileName = fullPath.split('/')[fullPath.split('/').length - 1];
            
            var currentPath = pathmaker(fullPath);

            if (fileName === validRouterFile) { 
                var currentRouter = require(fullPath);

                currentRouter.stack.forEach(function(router) {
                    routerLogger(router, currentPath); 
                });
             
                app.use(currentPath, currentRouter);
            } else {
                if (path.extname(fileName) !== '.swp')
                    console.log('Error'.red + ': encountered invalid router file → '+ currentPath.red + '/'.red + fileName.red);        
            }
        }
    });
}


module.exports = {
    init: function(app) {
        console.log('==== '.green + 'Setting up routes and middlewares'.italic.yellow + ' ===='.green);
        findRouters(routesDir, app);
        console.log('==== '.green + 'All routes and middlewares initialized'.italic.yellow + ' ===='.green);    }
};
