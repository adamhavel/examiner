var blueprints = require('../controllers/blueprints');

module.exports = function(app) {

   app.route('/api/blueprints/:subject?/:date?/:lang?')
      .get(blueprints.query);

   app.route('/api/blueprint/:subject/:date/:lang')
      .get(blueprints.get)
      .post(blueprints.create);

   app.param('subject', blueprints.validateSubject);
   app.param('date', blueprints.validateDate);
   app.param('lang', blueprints.validateLang);
};