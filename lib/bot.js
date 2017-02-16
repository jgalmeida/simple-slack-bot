const EE = require('events').EventEmitter;

module.exports = Bot;

function Bot (opts, Api, Ws) {
  const pingInterval = opts.pingInterval || 10000;
  const api = Api(opts);
  const ee = new EE();

  connect();

  return ee;

  function connect () {
    api.rtm(function (err, data) {
      if (err) {
        return ee.emit('error', err);
      }

      let timer;
      const ws = Ws(data);

      ws.on('open', function () {
        timer = setInterval(ping, pingInterval);
        ee.emit('open');
      });

      ws.on('message', function (data) {
        ee.emit('event', JSON.parse(data));
      });

      ws.on('error', function (data) {
        ee.emit('error', data);
      });

      ws.on('close', function (data) {
        ee.emit('close', data);

        clearInterval(timer);

        if (opts.autoReconnect) {
          ee.emit('reconnecting');
          connect();
        }
      });

      ee.send = function (data) {
        clearInterval(timer);
        ws.send(JSON.stringify(data));
        timer = setInterval(ping, pingInterval);
      };

      function ping () {
        ee.emit('ping');
        ws.send(JSON.stringify({
          id: +new Date(),
          type: 'ping'
        }));
      }
    });
  }
}
