var _ = require('lodash');
var async = require('async');
var phantom = require('node-phantom');

module.exports = function(url, metrics, wait, onComplete) {
  var resourceMetrics = _.filter(metrics, 'onResource');
  var contextMetrics = _.filter(metrics, 'onContext');

  var execute = function(err, ph) {
    if (err) {
      onComplete(err);
      return;
    }

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

  console.log('Evaluating: ' + url);
  phantom.create(execute, {phantomPath:require('phantomjs').path});
};