var _ = require('lodash');
var async = require('async');

module.exports = function(ph, url, metrics, wait, onComplete) {
  var resourceMetrics = _.filter(metrics, 'onResource');
  var contextMetrics = _.filter(metrics, 'onContext');

  console.log('Evaluating: ' + url);

  ph.createPage( function(page) {

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
    page.open( url, function (status) {
      // General stat collection
      pageMetrics.url = url;
      pageMetrics.loadTime = _.now() - startTime;
      pageMetrics.status = status;

      setTimeout(function() {
        if (status === 'success') {
          // In context metrics collection
          var executeTest = function(item, callback) {
            page.evaluate( item.onContext, function(result) {
              var payload = {};
              payload[item.name] = result;
              callback(null, payload);
            });
          };

          var done = function(err, results) {
            _.each(results, function(result) {
              pageMetrics = _.extend(pageMetrics, result);
            });

            console.log('Complete: ' + url);
            page.close();
            onComplete(null, pageMetrics);
          };

          async.mapSeries(contextMetrics, executeTest, done);
        } else {
          page.close();
          onComplete(status);
        }
      }, wait);
    });
  });
};