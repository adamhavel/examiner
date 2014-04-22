var auth = require('./middleware/auth');

module.exports = function(app, passport) {

   app.route('/api/user')

      .get(function(req, res) {
         res.send(req.isAuthenticated() ? req.user : null);
      })

      .post(function(req, res, next) {
         console.log(req.body);
         next();
      }, passport.authenticate('ldap'), function(req, res) {
         res.send(req.user);
      })

      .delete(function(req, res) {
         if (req.isAuthenticated()) {
            req.logout();
            res.redirect('/');
         }
         console.log('yay');
      });

};