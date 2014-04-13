var blueprints = require('../controllers/blueprints'),
    exams = require('../controllers/exams');

module.exports = function(app) {

   app.route('/api/blueprints/:subject?/:date?/:lang?')
      .get(blueprints.query);

   app.route('/api/blueprint/:subject/:date/:lang')
      .get(blueprints.get)
      .post(blueprints.create);

   app.param('subject', exams.validateSubject);
   app.param('date', exams.validateDate);
   app.param('lang', exams.validateLang);
};