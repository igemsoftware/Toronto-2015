var router   = require('express').Router();
var cp = require('child_process');

var getSBML = function(req, res){
  var catcher = cp.spawn('python3', ['fba/readJSON.py']);
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
  });
  catcher.on('close', function(code){
      results.exitcode = code;
          if(code == 0){
              res.send(results.output);
          }
  });
};

var conversion = function(req, res){
    var catcher = cp.exec('python3', ['fba/mainprogram.py', 'convert_all'], function(error, stdout, stderr){
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
          console.log('exec error: ', error);
      }
    });

};
var calculate_insert = function(req, res){
    var catcher = cp.exec('python3', ['fba/mainprogram.py', 'insert_all'], function(error, stdout, stderr){
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
          console.log('exec error: ', error);
      }
    });

};

router.get('/getSBML',getSBML);
router.get('/convert', conversion); // doesnt work at the moment. gotta fix it.
router.get('/insert', calculate_insert); // doesnt work at the moment. gotta fix it.


module.exports = router;
