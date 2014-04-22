//var users = require('../controllers/users');

module.exports = function(app, passport) {

   app.route('/api/login')
      .get(function(req, res, next) {
         req.body.username = 'havelad1';
         req.body.password = 'l9LYl4HMjhBNlAUftm8OG09Z';
         console.log(req.body);
         next();
      }, passport.authenticate('usermap'), function(req, res) {
         console.log(req.user);
      });


};