var blueprints = require('../controllers/blueprints');

module.exports = function(app) {

   app.route('/blueprints/:subject?/:lang?')
      .get(blueprints.get);

   app.param('subject', blueprints.filterBySubject);
   app.param('lang', blueprints.filterByLang);
};