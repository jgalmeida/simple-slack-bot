const Bot = require('../lib');

const bot = Bot({token: process.env.SLACK_BOT_API_TOKEN, autoReconnect: true});

bot.on('error', function (err) {
  throw err;
});

bot.on('event', function (data) {
  console.log('[Event]', data);

  const handler = handlers[data.type];

  if (handler) {
    handler(data, function (err, res) {
      if (err) {
        throw err;
      }

      bot.send({
        id: +new Date(),
        type: res.type,
        channel: res.channel,
        text: res.text
      });
    });
  }
});

const handlers = {
  message: message
};

function message (data, callback) {
  const res = {
    type: data.type,
    channel: data.channel,
    text: 'Hello guys, my name is limonada ' + new Date()
  };

  callback(null, res);
}
