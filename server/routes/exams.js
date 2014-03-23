var exams = require('../controllers/exams');

module.exports = function(app) {

   app.route('/exams')
      .get(exams.all);

   // Finish with setting up the articleId param
   //app.param('articleId', articles.article);
};