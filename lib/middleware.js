/**
 * The main middleware object.
 * 
 * Object exported includes a function named globalMiddlewares which takes the
 * express app as a parameter. Use this for middlewares that should be used
 * across all routes.
 *
 * Other included attributes should all be middlewares which need to called from
 * the route explicitly. These functions must follow the 'function(req, res, next)'
 * formatting. These functions should only be here if they are called explicitly
 * from multiple routes, otherwise specific middleware functions should be local
 * within that route.
 */
module.exports = {
    globalMiddlewares: function(app) {
        
        // ==== Body Parser ====
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());

        // ==== CORS: cross-origin resource sharing ====
        app.all('*', function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        // ==== Pre-Flight/Promise Request ====
        app.options('*', function(req, res) {
            res.sendStatus(200);
        });     
    }
};
