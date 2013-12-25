var fs = require('fs');
var _ = require('lodash');
var metrics = require('./metrics');

var kue = require('kue');
var jobs = kue.createQueue();

var columns = ['url'].concat( _.pluck(metrics, 'name') );

fs.open(process.argv[2], 'a', function(err, fd){
  fs.write(fd, columns.join(',') + '\n', null, undefined, function (err, written) {

    jobs.process('snuffle-result', function(job, done){
      // Map results object to value array
      var line = _.map(columns, function(col) {
        return JSON.stringify(job.data[col]);
      }).join(',');

      fs.write(fd, line + '\n', null, undefined, function(err, written) {
        console.log('Wrote: ' + job.data.url);

        if (!err) {
          job.remove();
        }

        done(err);
      });
    });
  });

  process.on('SIGINT', function(){
    console.log('closing output file...');
    fs.closeSync(fd);
    process.exit();
  });
});
