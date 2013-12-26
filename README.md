Snuffy
-------

Sniffing out all the metrics.

== Heroku
From: http://stackoverflow.com/questions/12607209/is-there-a-working-nodejs-phantomjs-heroku-buildpack

```
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
heroku config:set PATH=vendor/phantomjs/bin
```