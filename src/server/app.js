var express = require("express"),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 4567;
  
var phantom = require('phantom');
var evaluatePage = require('./evaluator');
var metrics = require('../metrics');

phantom.create( function(ph) {

  app.get("/", function(req, res) {
    var url = req.query.url;
    evaluatePage(ph, url, metrics, 2000, function(err, result) {
      if (!err) {
        res.send(result);
        res.end();
      } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err);
      }
    });
  });

  process.on('SIGINT', function(){
    console.log('closing phantom...');
    ph.exit();
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

app.listen(port);