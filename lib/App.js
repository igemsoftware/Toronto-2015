/**
 * The main App. Not to be confused with app.
 * 
 * This is where the loading of:
 *      -config
 *      -routes
 *      -models
 * is handled.
 * 
 * This module is made globally available from fba-api.js.
 */
var config = require('../config.js');

module.exports = {
    config: function() {
        return (process.env.NODE_ENV === 'prod') ? config.prod : config.dev;
    }
};
