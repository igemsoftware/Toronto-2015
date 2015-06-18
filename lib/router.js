var fs   = require('fs');
var path = require('path');

var routerLogger = App.Lib('init-routers-logger'); 

var routesDir = path.resolve('routes');
var validRouterFile = 'index.js'
var ignoredInvalidRouters = ['.swp'];


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
                if (ignoredInvalidRouters.indexOf(path.extname(fileName)) === -1)
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
