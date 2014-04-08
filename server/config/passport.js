'use strict';

var mongoose = require('mongoose'),
    OAuth2Strategy = require('passport-oauth2').OAuth2Strategy;

module.exports = function(passport) {

   passport.use('zuul', new OAuth2Strategy({
      authorizationURL: 'https://auth.fit.cvut.cz/oauth/oauth/authorize',
      tokenURL: 'https://auth.fit.cvut.cz/oauth/oauth/token',
      clientID: '4df4fcde-9ec3-4288-9415-3efa07e8ed11',
      clientSecret: 'rgrpWfZ6pDnnUGeHf3NeMCnY2hGgArnI',
      callbackURL: 'http://fit.cvut.cz'
   }, function(accessToken, refreshToken, profile, done) {
         console.log(profile);
      })
   );

};