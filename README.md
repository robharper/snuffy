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
 - google analytics
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

## Results
Results for the top 1,000 (CSV) and top 10,000 (CSV & JSON) can be found [here](/results). A few caveats:

 1. Missing results - a fair number of results are missing (e.g. the top 10,000 only has ~8,800 results). This is due to a few reasons: first, some sites are no longer operational or at least didn't respond during my test run; second, PhantomJS would reliably crash loading some sites; third, because I was running several scrapes concurrently a crash on one site would bring down the entire phantom instance and fail to return results from the other active scrapes. I used a retry count of 3 but often the bad site would be retried with the same poor concurrent victims causing them never to return a value. There is obviously room for improvement here.
 2. Missing script/image counts for the 10,000 - The top 1,000 has results for number of scripts and images loaded. When running the top 10,000 I had introduced a bug that caused these metrics not to be recorded. Oh well. Another time.
 3. Accuracy - I test for the existence of libraries by checking the `window` global. Sites that employ code modularization and compartmentalization (say using RequireJS) may not expose libraries globally and as such won't be detected.
 4. Representativeness - A number of the tested sites require login to actually access the meat and potatoes. As such, results for sites like `facebook.com` will be uninteresting because they won't tell us what the actual facebook "app" is using, just the login/home page.

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
