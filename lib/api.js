const assert = require('assert');
const request = require('request');
const throttle = require('lodash.throttle');

module.exports = Api;

function Api (opts) {
  assert(opts.token, 'Token is required');

  const apiUrl = 'https://slack.com/api' || opts.apiUrl;

  return {
    rtm: throttle(action('/rtm.start'), 5000)
  };

  function action (method) {
    return function (callback) {
      const url = apiUrl + method + '?token=' + opts.token;

      request(url, function (err, res) {
        if (err) {
          return callback(err);
        }

        if (res.statusCode === 429) {
          return callback(new Error(res.body));
        }

        callback(null, JSON.parse(res.body));
      });
    };
  }
}
