var env = require('node-env-file');
// Load any undefined ENV variables form a specified file.
env(__dirname + '/.env');

require("babel-core/register");
require("babel-polyfill");
require('./server');