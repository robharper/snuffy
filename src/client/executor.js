var rest = require('restler');
var csv = require('csv');
var _ = require('lodash');
var metrics = require('../metrics');

var kue = require('kue');
var jobs = kue.createQueue();

var columns = ['url'].concat( _.pluck(metrics, 'name') );

var program = require('commander');
program
  .description('Processes queued snuffle tasks using processing server and writes output to a csv file')
  .usage('[options] <file>')
  .option('-s, --server [url]', 'Url of processing server [http://evening-peak-4081.herokuapp.com/]')
  .parse(process.argv);

if (!program.args[0]) {
  console.log('  An output filename must be specified');
  program.help();
}


var output = csv().to.path(program.args[0], {
  flags: 'a',
  eof: true,
  columns: columns
});

// Write column headers
output.write(columns);

// Start processing jobs...
jobs.process('snuffle', function(job, done){

  console.log('Starting: ' + job.data.url);

  rest.get(program.server || 'http://evening-peak-4081.herokuapp.com/', {query: {url: job.data.url}})
    .on('fail', function(data, response) {
      console.error('Fail ' + job.data.url + ' - ('+response.statusCode+')');
      // Allow remote to recover before continuing
      setTimeout(function() {
        // 503 indicates app crashed, fail job, allow retry
        // otherwise likely test page 404'd
        done(response.statusCode == 503 ? data : null);
      }, 10000);
    })
    .on('error', function(err, response) {
      console.error('Error ' + job.data.url, err );
      done(err);
    })
    .on('success', function(result) {
      console.log('Finished: ' + job.data.url);

      // Sanitize for output
      _.each(result, function(value, key) {
        if (value == null || value === false) {
          result[key] = '';
        }
      });

      result.rank = job.data.rank;

      output.write(result);

      // Rate limit, delay job completion.
      setTimeout(function() {
        done();
      }, 3000);
    });
});

process.on('SIGINT', function() {
  console.log('closing output file...');
  output.end();
  process.exit();
});


// Start server, expose job api for monitoring
kue.app.listen(3000);