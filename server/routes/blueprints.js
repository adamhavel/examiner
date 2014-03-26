var blueprints = require('../controllers/blueprints');

module.exports = function(app) {

   app.route('/blueprints/:subject?/:date?/:lang?')
      .get(blueprints.query);

   app.route('/blueprint/:subject/:date/:lang')
      .get(blueprints.get);

   app.param('subject', blueprints.filterBySubject);
   app.param('date', blueprints.filterByDate);
   app.param('lang', blueprints.filterByLang);
};