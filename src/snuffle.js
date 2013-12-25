var phantom = require('phantom');
var evaluatePage = require('./evaluator');

var metrics = require('./metrics');

var kue = require('kue');
var jobs = kue.createQueue();

phantom.create( function(ph) {

  jobs.process('snuffle', function(job, done){
    evaluatePage(ph, job.data.url, metrics, 2000, function(err, result) {
      if (result) {
        result.title = 'Results for ' + result.url;
        jobs.create('snuffle-result', result).save();
        job.remove();
        done();
      } else {
        done(err);
      }
    });
  });

  process.on('SIGINT', function(){
    console.log('exiting phantom...');
    ph.exit();
    process.exit();
  });
});


// xxx
// phantom.exit();