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
      if (response.stage === 'end' && response.contentType && response.contentType.indexOf('image/') === 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    name: 'scriptCount',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.stage === 'end' && response.contentType && response.contentType.indexOf('/javascript') > 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    name: 'doubleclick',
    matcher: /doubleclick.(com|net)/,
    onResource: function(response, memo) {
      return memo || (response.stage === 'end' && response.url && !!this.matcher.exec(response.url));
    }
  }
];


var evaluatePage = function(ph, url, metrics, onComplete) {
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
      if (opened) {
        console.log('Concurrency error');
        return;
      }
      opened = true;

      // General stat collection
      pageMetrics.url = url;
      pageMetrics.loadTime = _.now() - startTime;
      pageMetrics.status = status;

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
        onComplete(null, pageMetrics);
      };

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
  // Run one page at a time, phantom bridge is having serious concurrency issues
  async.mapSeries(pagesToTest, function(url, callback) {
    evaluatePage(ph, url, defaultMetrics, callback);
  }, function(err, results) {
    _.each(results, function(result) {
      console.log('======================================');
      console.dir(result);
    });

    ph.exit();
  });
});