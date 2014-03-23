var path = require('path'),
    _ = require('lodash');

module.exports = _.extend(
   {
      root: path.normalize(__dirname + '/..'),
      port: process.env.PORT || 5000,
      sessionSecret: 'examiner',
      sessionCollection: 'sessions'
   },
   require('./env/' + process.env.NODE_ENV) || {}
);