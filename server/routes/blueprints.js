var blueprints = require('../controllers/blueprints'),
    exams = require('../controllers/exams'),
    auth = require('./middleware/auth'),
    _ = require('lodash');

module.exports = function(app) {

   var isAuthorized = function(req, res, next) {
      if (req.params.subject && _.indexOf(req.user.subjects, req.params.subject) === -1) {
         return res.send(403, 'Access forbidden');
      }
      next();
   };

   app.route('/api/blueprints')
      .get(auth.isAuthenticated, /*auth.isTeacher,*/ isAuthorized, blueprints.query);

   app.route('/api/blueprint/:subject/:date/:lang')
      .get(auth.isAuthenticated, isAuthorized, blueprints.get)
      .post(auth.isAuthenticated, auth.isTeacher, isAuthorized, blueprints.create);

   app.param('subject', exams.validateSubject);
   app.param('date', exams.validateDate);
   app.param('lang', exams.validateLang);
};