var exams = require('../controllers/exams'),
    auth = require('./middleware/auth'),
    _ = require('lodash');

module.exports = function(app) {

   var isAuthorized = function(req, res, next) {
      if (req.params.subject && _.indexOf(req.user.subjects, req.params.subject) === -1) {
         return res.send(403, 'Access forbidden');
      } else if (req.user.role === 'student' && req.param('uid') && req.param('uid') !== req.user._id) {
         return res.send(403, 'Access forbidden');
      }
      next();
   };

   app.route('/api/exams')
      .get(auth.isAuthenticated, isAuthorized, exams.query);

   app.route('/api/exam/:subject/:date/:lang/:uid')
      .get(auth.isAuthenticated, isAuthorized, exams.get)
      .put(auth.isAuthenticated, isAuthorized, exams.update)
      .post(auth.isAuthenticated, isAuthorized, exams.create);

   app.param('uid', exams.validateUserID);
   app.param('subject', exams.validateSubject);
   app.param('date', exams.validateDate);
   app.param('lang', exams.validateLang);

};