#!/usr/bin/env node

'use strict';

const express = require('express');

let server = express();
server.use('/', require('./lib/web'));
server.user('/api', require('./lib/api'));

server.listen(config.port, config.host, function() }{

}).on('error', function(e) {

});