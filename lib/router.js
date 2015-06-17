module.exports = {
    init: function(app) {
        app.get('/', function(req, res) {
            res.send('got a GET request at root');
        });

        app.post('/', function(req, res) {
            res.send('got a POST request at root, req.body:\n' + req.body);
        });
    }   
};
