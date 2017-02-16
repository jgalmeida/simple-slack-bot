const Api = require('./api');
const Ws = require('./ws');
const Bot = require('./bot');

module.exports = init;

function init (opts) {
  return Bot(opts, Api, Ws);
}
