'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    LDAPStrategy = require('passport-ldapauth').Strategy;

module.exports = function(passport) {

   passport.serializeUser(function(user, done) {
      done(null, user._id);
   });

   passport.deserializeUser(function(uid, done) {
      User.findById(uid, function(err, user) {
         done(err, user);
      });
   });

   passport.use('ldap', new LDAPStrategy(
      {
         server: {
            url: 'ldaps://ldap.fit.cvut.cz:636',
            searchBase: 'ou=People,o=fit.cvut.cz',
            searchFilter: '(uid={{username}})',
            searchAttributes: ['cn','uid']
         }
      },
      function(entry, done) {
         User.findByIdAndUpdate(entry.uid, { lastActive: new Date() }, function(err, user) {
            if (err) {
               return done(err);
            }
            if (!user) {
               var newUser = {
                  _id: entry.uid,
                  name: entry.cn,
                  lastLogin: new Date(),
                  role: 'teacher',
                  subjects: ['mi-mdw', 'mi-w20']
               };
               User.create(newUser, function(err, user) {
                  if (err) {
                     return done(err);
                  }
                  console.log('new');
                  return done(null, user);
               });
            } else {
               console.log('user already in db');
               return done(null, user);
            }

         });
      }
   ));

};