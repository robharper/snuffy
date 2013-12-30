var kue = require('kue');
var jobs = kue.createQueue();

var csv = require('csv');

var max = parseInt(process.argv[3], 10) || 100;

  // XXX TEST
  // var sites = [
  //   [0,'http://news.yahoo.com'],
  //   [0,'http://www.cnn.com'],
  //   [0,'http://www.huffingtonpost.com'],
  //   [0,'http://reddit.com'],
  //   [0,'http://bbc.co.uk/news/'],
  //   [0,'http://nytimes.com'],
  //   [0,'http://news.google.com'],
  //   [0,'http://weather.com'],
  //   [0,'http://theguardian.com'],
  //   [0,'http://foxnews.com'],
  //   [0,'http://forbes.com'],
  //   [0,'http://timesofindia.indiatimes.com'],
  //   [0,'http://shutterstock.com'],
  //   [0,'http://online.wsj.com']
  // ];
  // XXX TEST

csv()
  .from.path( process.argv[2] )
  .to.array( function(sites) {
    var idx = 0;
    while (idx < max && idx < sites.length) {
      jobs.create('snuffle', {
        title: sites[idx][1],
        url: 'http://'+sites[idx][1]
      }).attempts(3).save();
      idx += 1;
    }

    console.log('All scheduled...');
  });