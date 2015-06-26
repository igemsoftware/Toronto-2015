/**
 * The main configuration file.
 * 'prod' and 'dev' must both follow this schema:
 * {
 *      port: Number
 *      mongodb: {
 *              hostname : String,
 *              username : String,
 *              password : String,
 *              port     : Number,
 *              database : String
 *      }
 * }
 */
module.exports = {
    prod: {
        port: 6740
    },
    dev: {
        port: 9001,
        mongodb: {
            hostname : 'localhost',
            username : '',
            password : '',
            port     : '',
            database : 'fba'
        }
    }
};
