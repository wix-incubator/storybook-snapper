const applitoolsConfig = require('./config/applitools.config');

let config;

try {
  config = require('./applitools.private.config.js');
} catch (e) {}

module.exports = applitoolsConfig({config, asyncSelector: true});
