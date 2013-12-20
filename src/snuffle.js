var async = require('async');
var _ = require('lodash');
var webpage = require('webpage');
var system = require('system');

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
      if (response.stage === 'end' && response.contentType && response.contentType.indexOf('javascript') > 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    // Note: due to phantomjs bug, this value is misreported
    name: 'totalResourceSize',
    onResource: function(response, memo) {
      memo = memo || 0; 
      if (response.stage == 'start' && response.bodySize) {
        memo += response.bodySize;
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


var evaluatePage = function(url, metrics, wait, onComplete) {
  var resourceMetrics = _.filter(metrics, 'onResource');
  var contextMetrics = _.filter(metrics, 'onContext');

  console.log('Evaluating: ' + url);

  var page = webpage.create();

  var pageMetrics = {};

  // Network request response metrics collection
  page.onResourceReceived = function (response) {
    if (!response) return;
    _.each(resourceMetrics, function(metric) {
      pageMetrics[metric.name] = metric.onResource(response, pageMetrics[metric.name]);
    });
  };

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
        _.each(contextMetrics, function(metric) {
          var result = page.evaluate( metric.onContext );
          pageMetrics[metric.name] = result;
        });
      }

      onComplete(null, pageMetrics);
    }, wait);
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

async.mapLimit(pagesToTest, 3, function(url, callback) {
  evaluatePage(url, defaultMetrics, 2000, callback);
}, function(err, results) {
  system.stdout.write( JSON.stringify(results, null, 2) );
  phantom.exit();
});
