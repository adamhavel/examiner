var blueprints = require('../controllers/blueprints'),
    exams = require('../controllers/exams'),
    auth = require('./middleware/auth'),
    _ = require('lodash');

module.exports = function(app) {

   var isAuthorized = function(req, res, next) {
      if (req.subject && _.indexOf(req.user.subjects, req.subject) === -1) {
         return res.send(401, 'User is not authorized');
      }
      next();
   };

   app.route('/api/blueprints/:subject?/:date?/:lang?')
      .get(auth.isAuthenticated, isAuthorized, blueprints.query);

   app.route('/api/blueprint/:subject/:date/:lang')
      .get(auth.isAuthenticated, isAuthorized, blueprints.get)
      .post(auth.isAuthenticated, auth.isTeacher, isAuthorized, blueprints.create);

   app.param('subject', exams.validateSubject);
   app.param('date', exams.validateDate);
   app.param('lang', exams.validateLang);
};