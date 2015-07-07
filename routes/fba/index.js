var router   = require('express').Router();
var cp = require('child_process');

var getJSON = function(req, res){
  var catcher = cp.spawn('python3', ['fba/dos.py', 'get_json']);
  var results = {
      output: "",
      errorlog:  null,
      exitcode:  null
  }

  catcher.stdout.on('data', function(data){
      results.output += data;
  });
  catcher.stderr.on('data', function(data){
      results.errorlog = data.toString();
      console.log(results.errorlog);
  });
  catcher.on('close', function(code){
      results.exitcode = code;
          if(code == 0){
              res.send(results.output);
          }
  });
};

var conversion = function(req, res){
    var catcher = cp.spawn('python3', ['fba/dos.py', 'convert_all']);
    var results = {
        output: "",
        errorlog:  null,
        exitcode:  null
    }
    catcher.stdout.on('data', function(data){
        results.output += data;
    });
    catcher.stderr.on('data', function(data){
        results.errorlog = data.toString();
        console.log(results.errorlog);
    });
    catcher.on('close', function(code){
        results.exitcode = code;
            if(code == 0){
                res.send(results.output);
            }
    });

};
var calculate_insert = function(req, res){
    var catcher = cp.exec('python3', ['fba/dos.py', 'insert_all']);
    var results = {
        output: "",
        errorlog:  null,
        exitcode:  null
    }
    catcher.stdout.on('data', function(data){
        results.output += data;
    });
    catcher.stderr.on('data', function(data){
        results.errorlog = data.toString();
        console.log(results.errorlog);
    });
    catcher.on('close', function(code){
        results.exitcode = code;
            if(code == 0){
                res.send(results.output);
            }
    });
};

router.get('/getJSON', getJSON);
router.get('/convert', conversion);
router.get('/insert', calculate_insert);

module.exports = router;
