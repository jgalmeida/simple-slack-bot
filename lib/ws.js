const WebSocket = require('ws');
const assert = require('assert');

module.exports = WS;

function WS (opts) {
  assert(opts.url, 'Url is required');

  const ws = new WebSocket(opts.url);

  return ws;
}
