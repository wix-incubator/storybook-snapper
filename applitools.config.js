const appName = require('./package').name;
const applitoolsConfig = require('./src/config/applitools.config');

let apiKey;

try {
  apiKey = require('./applitools.private.config.js').apiKey;
} catch (e) {}

module.exports = applitoolsConfig({appName, apiKey});
