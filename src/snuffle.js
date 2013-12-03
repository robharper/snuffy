var phantom = require('phantom');
var async = require('async');
var _ = require('lodash');

var defaultMetrics = [
  {
    name: 'googleAnalytics',
    onContext: function() {
      return !!(window.ga || window._gaq);
    }
  },
  {
    name: 'mixpanel',
    onContext: function() {
      return !!window.mixpanel;
    }
  },
  {
    name: 'marketo',
    onContext: function() {
      return !!window.mktoMunchkin;
    }
  },
  {
    name: 'chartbeat',
    onContext: function() {
      return !!window.pSUPERFLY;
    }
  },
  {
    name: 'kissmetrics',
    onContext: function() {
      return !!window.KM;
    }
  },
  {
    name: 'comscore',
    onContext: function() {
      return !!window.COMSCORE;
    }
  },
  {
    name: 'hubspot',
    onContext: function() {
      return !!window._hsq;
    }
  },
  {
    name: 'optimizely',
    onContext: function() {
      return !!window.optimizely;
    }
  },
  {
    name: 'pingdom',
    onContext: function() {
      return !!window._prum;
    }
  },
  {
    name: 'uservoice',
    onContext: function() {
      return !!window.UserVoice;
    }
  },
  {
    name: 'jQuery',
    onContext: function() {
      return window.jQuery && window.jQuery.fn.jquery;
    }
  },
  {
    name: 'imageCount',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.contentType && response.contentType.indexOf('image/') === 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    name: 'scriptCount',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.contentType && response.contentType.indexOf('/javascript') > 0) {
        memo += 1;
      }
      return memo;
    }
  }
];


var evaluatePage = function(ph, url, metrics, onComplete) {
  console.log('Evalulating: ' + url);
  ph.createPage( function(page) {
    var pageMetrics = {};

    page.set('onResourceReceived', function (response) {
      if (!response) return;
      // Allow each metric that evaluates responses to handle
      _.each(metrics, function(metric) {
        if (metric.onResource) {
          pageMetrics[metric.name] = metric.onResource(response, pageMetrics[metric.name]);
        }
      });
    });

    page.open( url, function (status) {
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

        onComplete(null, pageMetrics);
      };

      console.log('status: ', status);
      var contextMetrics = _.filter(metrics, function(metric) { return metric.onContext; });
      async.mapSeries(contextMetrics, executeTest, done);
    });
  });
};




var pagesToTest = [
  'http://news.yahoo.com',
  'http://www.cnn.com',
  'http://www.huffingtonpost.com',
  'http://reddit.com',
  'http://bbc.co.uk/news/',
  'http://nytimes.com',
  'http://news.google.com',
  'http://weather.com',
  'http://theguardian.com',
  'http://foxnews.com',
  'http://forbes.com',
  'http://timesofindia.indiatimes.com',
  'http://shutterstock.com',
  'http://online.wsj.com'
];

phantom.create( function(ph) {
  async.mapLimit(pagesToTest, 5, function(url, callback) {
    evaluatePage(ph, url, defaultMetrics, function(err, result) {
      result.url = url;
      callback(null, result);
    });
  }, function(err, results) {
    _.each(results, function(result) {
      console.log('======================================');
      console.dir(result);
    });

    ph.exit();
  });
});