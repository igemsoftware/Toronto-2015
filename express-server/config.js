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
        port: 10000, // do not change this
        mongodb: {
            hostname : 'localhost',
            username : '',
            password : '',
            port     : '',
            database : 'fba'
        }
    },
    dev: {
        port: 9001,
        staticStore: 'static',

        mongodb: {
            hostname : 'localhost',
            username : '',
            password : '',
            port     : '',
            database : 'fba'
        },

        mysql: {
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'fba'
        }
    }
};
