/**
 * The main App. Not to be confused with app.
 * 
 * This is where the loading of:
 *      -config
 *      -middleware
 *      -models
 *      -routes
 * is handled.
 * 
 * This module is made globally available from fba-api.js.
 * see: https://nodejs.org/api/globals.html#globals_global
 */
var path = require('path');
var colors = require('colors');
var config = require('../config.js');

var DIRS = {
    model      : './models',
    middleware : './middleware',
    library    : './lib'
};


function tryRequire (moduleName, type) {
    try {
        return require(path.resolve(DIRS[type], moduleName));
    } catch(e) {
        console.log('Error'.red + ' requiring ' + type + ' ' + moduleName);
        throw new Error(e);
    }
}


module.exports = {
    config: function() {
        return (process.env.NODE_ENV === 'prod') ? config.prod : config.dev;
    },
    MW: function(middlewareName) {
        return tryRequire(middlewareName, 'middleware');    
    },
    Model: function(modelName) {
        return tryRequire(modelName, 'model');  
    },
    Lib: function(libName) {
        return tryRequire(libName, 'library');
    } 
};
