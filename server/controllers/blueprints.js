var mongoose = require('mongoose'),
    Exam = mongoose.model('Exam');

exports.filterBySubject = function(req, res, next, subject) {
   if (req.blueprintsQuery) {
      req.blueprintsQuery = req.blueprintsQuery.find({ subject: new RegExp('^' + subject + '$', 'i') });
   } else {
      req.blueprintsQuery = Exam.find({ subject: new RegExp('^' + subject + '$', 'i') });
   }
   next();
};

exports.filterByLang = function(req, res, next, lang) {
   if (req.blueprintsQuery) {
      req.blueprintsQuery = req.blueprintsQuery.find({ lang: new RegExp('^' + lang + '$', 'i') });
   } else {
      req.blueprintsQuery = Exam.find({ lang: new RegExp('^' + lang + '$', 'i') });
   }
   next();
};

exports.get = function(req, res) {
   var query = req.blueprintsQuery || Exam.find();
   query.exec(function(err, blueprints) {
      if (err) {
         res.send(500);
      } else {
         res.send(blueprints);
      }
   });
};