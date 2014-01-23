var async = require('async');
var csv = require('csv');

var kue = require('kue');
var jobs = kue.createQueue();

var program = require('commander');

program
  .description('Enqueues snuffle tasks to the queue from a csv file containing ranks and urls')
  .usage('[options] <file>')
  .option('-s, --start [offset]', 'Row of input csv from which to begin adding jobs [0]', parseInt)
  .option('-c, --count [number]', 'Number of rows to add [100]', parseInt)
  .option('-r, --retries [number]', 'Number of times to retry failed jobs [3]', parseInt)
  .parse(process.argv);

if (!program.args[0]) {
  console.log('  An input file must be specified');
  program.help();
}

csv()
  .from.path( program.args[0] )
  .to.array( function(sites) {
    var slice = sites.slice(program.start, program.start+program.count);
    console.log('Adding: ' + slice.length + ' of ' + sites.length);
    async.each(slice, function(row, callback) {
      // Schedule kue job
      jobs.create('snuffle', {
        title: row[1],
        rank: row[0],
        url: 'http://'+row[1]
      }).attempts(program.retries).save(callback);
    }, function(err) {
      // All done, can exit
      console.log('All scheduled...');
      process.exit();
    });
  });