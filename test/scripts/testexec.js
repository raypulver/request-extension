"use strict";

const hipri = require('./hipriext'),
  lopri = require('./lowpriext'),
  request = require('request');

lopri(request);
hipri(request);

request.get('http://google.com', function (err, resp, body) {});
