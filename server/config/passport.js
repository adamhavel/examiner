'use strict';

var mongoose = require('mongoose'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    LDAPStrategy = require('passport-ldapauth').Strategy;

module.exports = function(passport) {

   passport.use('zuul', new OAuth2Strategy({
      authorizationURL: 'https://auth.fit.cvut.cz/oauth/oauth/authorize',
      tokenURL: 'https://auth.fit.cvut.cz/oauth/oauth/token',
      clientID: '4df4fcde-9ec3-4288-9415-3efa07e8ed11',
      clientSecret: 'rgrpWfZ6pDnnUGeHf3NeMCnY2hGgArnI',
      callbackURL: 'http://dev.vitvar.com:5000/api/test'
   }, function(accessToken, refreshToken, profile, done) {
         done(err, profile);
      })
   );

   passport.use('usermap', new LDAPStrategy(
      {
         server: {
            url: 'ldaps://ldap.fit.cvut.cz:636',
            searchBase: 'ou=People,o=fit.cvut.cz',
            searchFilter: '(uid={{username}})'
         }
      },
      function(user, done) {
         console.log(user);
         return done(null, user);
      }
   ));

};