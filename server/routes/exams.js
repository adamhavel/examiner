var exams = require('../controllers/exams');

module.exports = function(app) {

   app.route('/api/exams/:subject?/:date?/:lang?/:uid?')
      .get(exams.query);

   app.route('/api/exam/:subject/:date/:lang/:uid')
      .get(exams.get)
      .put(exams.update)
      .post(exams.create);

   app.param('uid', exams.validateUserID);
   app.param('subject', exams.validateSubject);
   app.param('date', exams.validateDate);
   app.param('lang', exams.validateLang);

};