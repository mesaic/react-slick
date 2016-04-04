/* eslint-disable */

require('babel-register')({
  plugins: ['babel-plugin-espower']
});

require('./jsdomSetup');

const assert = require('power-assert');
global.assert = assert;
