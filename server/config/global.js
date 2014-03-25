var path = require('path'),
    _ = require('lodash');

module.exports = _.extend(
   {
      root: path.normalize(__dirname + '/..'),
      port: process.env.PORT || 5000,
      sessionSecret: 'inconceivable',
      sessionCollection: 'sessions'
   },
   require('./env/' + process.env.NODE_ENV) || {}
);