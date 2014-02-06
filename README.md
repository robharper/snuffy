Snuffy
-------

> Sniffing out all the metrics. 

This is a little pet project of mine. Hacky and unstable, but fun. It scans sites in the Alexa top 1,000,000 sites looking for usage of the following libraries and analytics platforms:

 - angular
 - backbone
 - d3
 - dojo
 - ember
 - ext
 - fastclick
 - hammer
 - jquery-ui
 - jquery
 - knockout
 - lodash
 - modernizr
 - moment
 - mootools
 - prototype
 - require
 - scriptaculous
 - socket.io
 - transit
 - underscore
 - yui
 - zepto
 - chartbeat
 - comscore
 - crazyegg
 - ga
 - hubspot
 - kissmetrics
 - marketo
 - mixpanel
 - optimizely
 - pingdom
 - quantcast
 - tapstream
 - vero
 - woopra
 - adroll
 - doubleclick

## Installation and Usage
Two parts, client and server. 

Client has a job scheduler that reads urls from a CSV file (specifically the Alexa top 1,000,000 sites list) and schedules jobs using Kue (+ Redis). Client also has an executor that runs the scraping jobs via calls to the server-side component.

Server exposes a single endpoint that accepts a url to hit. It uses PhantomJS to load the page and then runs a series of pluggable evaluators. Finally it returns the result as a JSON payload. I run this part on Heroku.

### Heroku Setup
From: http://stackoverflow.com/questions/12607209/is-there-a-working-nodejs-phantomjs-heroku-buildpack

```
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
heroku config:set PATH=vendor/phantomjs/bin
```
