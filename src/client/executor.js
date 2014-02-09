var fs = require('fs');
var rest = require('restler');
var csv = require('csv');
var JSONStream = require('JSONStream');
var _ = require('lodash');
var metrics = require('../metrics');

var kue = require('kue');
var jobs = kue.createQueue();

var columns = ['url', 'rank'].concat( _.pluck(metrics, 'name') );


var program = require('commander');
program
  .description('Processes queued snuffle tasks using processing server and writes output to a csv+json files')
  .usage('[options] <file>')
  .option('-s, --server [url]', 'Url of processing server [http://evening-peak-4081.herokuapp.com/]')
  .option('-c, --concurrent [number]', 'Number of concurrent snuffy calls [1]', parseInt)
  .parse(process.argv);

if (!program.args[0]) {
  console.log('  An output filename must be specified');
  program.help();
}

_.defaults(program, {
  server: 'http://evening-peak-4081.herokuapp.com/',
  concurrent: 1
});

//
//
//

var outputCsv = csv().to.path(program.args[0], {
  flags: 'a',
  eof: true,
  columns: columns
});

var outputJSON = JSONStream.stringify();
outputJSON.pipe( fs.createWriteStream(program.args[0]+'.json') );

// Write column headers
outputCsv.write(columns);

//
//
//

// Start processing jobs...
jobs.process('snuffle', program.concurrent, function(job, done){

  console.log('Starting: ' + job.data.url);

  rest.get(program.server, {query: {url: job.data.url}})
    .on('fail', function(data, response) {
      console.error('Fail ' + job.data.url + ' - ('+response.statusCode+')');
      // Allow remote to recover before continuing
      setTimeout(function() {
        // 503 indicates app crashed, fail job, allow retry
        // otherwise likely test page 404'd, don't retry
        done(response.statusCode >= 500 ? data : null);
      }, 5000);
    })
    .on('error', function(err, response) {
      console.error('Error ' + job.data.url, err );
      done(err);
    })
    .on('success', function(result) {
      console.log('Finished: ' + job.data.url);

      result.rank = job.data.rank;

      outputJSON.write(result);

      // Sanitize for csv output
      _.each(result, function(value, key) {
        if (value == null || value === false) {
          result[key] = '';
        }
      });
      outputCsv.write(result);

      // Rate limit, delay job completion.
      setTimeout(function() {
        done();
      }, 1000);
    });
});

process.on('SIGINT', function() {
  console.log('closing output files...');
  outputCsv.end();
  outputJSON.end();
  process.exit();
});


// Start server, expose job api for monitoring
kue.app.listen(3000);