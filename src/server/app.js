var express = require("express"),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 4567;

var evaluatePage = require('./evaluator');
var metrics = require('../metrics');

app.get("/", function(req, res) {
  var url = req.query.url;
  evaluatePage(url, metrics, 2000, function(err, result) {
    if (result) {
      res.jsonp(result);
      res.end();
    } else {
      // evaluate page fails if phantom fails to load the target page or if phantom crashes
      res.writeHead( err === 'phantom crash' ? 500 : 404, {'Content-Type': 'text/plain'});
      res.end(err);
    }
  });
});


app.configure(function(){
  app.use( express.compress() );
  app.use( express.favicon() );
  app.use( express.logger('dev') );
  app.use( express.json() );
  app.use( express.urlencoded() );
  app.use( express.methodOverride() );

  app.use(app.router);
});

app.listen(port, function() {
  console.log('Server running on port ' + port);
});