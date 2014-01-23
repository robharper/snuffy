var _ = require('lodash');
var async = require('async');
var phantom = require('node-phantom');


var sharedPhantom = null;
var activeRequests = [];

var executeScrape = function(ph, url, metrics, wait, onComplete) {
  var resourceMetrics = _.filter(metrics, 'onResource');
  var contextMetrics = _.filter(metrics, 'onContext');

  ph.createPage( function(err, page) {
    if (err) {
      onComplete(err);
      return;
    }

    var pageMetrics = {};

    // Network request response metrics collection
    page.set('onResourceReceived', function (response) {
      if (!response) return;
      _.each(resourceMetrics, function(metric) {
        pageMetrics[metric.name] = metric.onResource(response, pageMetrics[metric.name]);
      });
    });

    var startTime = _.now();
    var opened = false;
    page.open( url, function (err, status) {
      if (err || status !== 'success') {
        onComplete(err || status);
        return;
      }

      // General stat collection
      pageMetrics.url = url;
      pageMetrics.loadTime = _.now() - startTime;
      pageMetrics.status = status;

      setTimeout(function() {
        // In context metrics collection
        var executeTest = function(item, callback) {
          page.evaluate( item.onContext, function(err, result) {
            var payload = {};
            payload[item.name] = result;
            callback(err, payload);
          });
        };

        var done = function(err, results) {
          _.each(results, function(result) {
            pageMetrics = _.extend(pageMetrics, result);
          });

          console.log('Complete: ' + url);
          page.close();
          onComplete(err, pageMetrics);
        };

        async.mapSeries(contextMetrics, executeTest, done);
      }, wait);
    });
  });
};


module.exports = function(url, metrics, wait, onComplete) {
  console.log('Evaluating: ' + url);

  var wrappedCallback = function(err, result) {
    activeRequests.splice(activeRequests.indexOf(wrappedCallback), 1);
    onComplete(err, result);
  };
  activeRequests.push(wrappedCallback);

  if (!sharedPhantom) {
    phantom.create(function(err, ph) {
      // Can't create, try again next time...
      if (err) {
        wrappedCallback(err);
        return;
      }

      sharedPhantom = ph;

      // Nasty: digging into the internals of node-phantom to detect phantom crashes
      sharedPhantom._phantom.on('exit', function(code,signal){
        console.warn('============= Shared phantom instance crashed - will restart on next request');
        // Fail all active requests
        while (activeRequests.length > 0) {
          console.log('Terminating request...');
          activeRequests[activeRequests.length-1]('phantom crash');
        }
        sharedPhantom = null;
      });

      // Execute with new phantom
      executeScrape(sharedPhantom, url, metrics, wait, wrappedCallback);
    });
  } else {
    // Reuse existing phantom
   executeScrape(sharedPhantom, url, metrics, wait, wrappedCallback);
  }
};