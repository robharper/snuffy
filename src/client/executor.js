var rest = require('restler');
var fs = require('fs');
var _ = require('lodash');
var metrics = require('../metrics');

var server = process.argv[2] || 'http://localhost:4567';
var outputFile = process.argv[3] || 'test.csv';

var kue = require('kue');
var jobs = kue.createQueue();

var columns = ['url'].concat( _.pluck(metrics, 'name') );

fs.open(outputFile, 'a', function(err, fd){
  // Write column header
  fs.write(fd, columns.join(',') + '\n', null, undefined, function (err, written) {

    // Start processing jobs...
    jobs.process('snuffle', function(job, done){
      
      console.log('Starting: ' + job.data.url);

      rest.get(server, {query: {url: job.data.url}})
        .on('complete', function(result) {
          if (result instanceof Error) {
            // Snuffle request failed
            done(result);
          } else {
            // Map results object to value array
            var line = _.map(columns, function(col) {
              return JSON.stringify(result[col]);
            }).join(',');

            fs.write(fd, line + '\n', null, undefined, function(err, written) {
              console.log('Wrote: ' + job.data.url);
              done(err);
            });
          }
        });
    });
  });

  process.on('SIGINT', function(){
    console.log('closing output file...');
    fs.closeSync(fd);
    process.exit();
  });
});


// Start server, expose job api for monitoring
kue.app.listen(3000);