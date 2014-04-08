//var users = require('../controllers/users');

module.exports = function(app, passport) {

   app.route('/api/login')
      .get(passport.authenticate('zuul'));

   app.route('/api/test')
      .get(function(req, res) {
         res.send(req.user);
         // if (!req.isAuthenticated()) {
         //    return res.send(401, 'User is not authorized');
         // } else {
         //    return res.send(404, 'User not found');
         // }
      });


};