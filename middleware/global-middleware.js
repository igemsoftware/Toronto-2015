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
var bodyParser = require('body-parser');
var morgan     = require('morgan');

module.exports = {
    apply: function(app) { 
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

        // ==== Morgan ====
        app.use(morgan(
           ':method '.magenta + 
           ':url '.green + 
           ':status '.blue +
           ':res[content-length] '.italic.grey + 'characters '.italic.grey + 'sent in ' + ':response-time ms'.grey
        ));

        // ==== Body Parser ====
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());
    }    
};
