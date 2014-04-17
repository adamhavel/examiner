var mongoose = require('mongoose'),
    Exam = mongoose.model('Exam');

exports.validateSubject = function(req, res, next, subject) {
   var pattern = /^\w{2}-\w{3}$/i;
   if (!pattern.test(subject)) {
      return next(new Error ('not a valid subject code'));
   }
   req.subject = subject;
   return next();
};

exports.validateDate = function(req, res, next, date) {
   var pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/i;
   if (!pattern.test(date)) {
      return next(new Error ('not a valid date'));
   }
   // var dateArr = date.split('-').map(function (value) {
   //    return parseInt(value, 0);
   // });
   // req.startDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
   // req.endDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2] + 1);
   req.date = date;
   return next();
};

exports.validateLang = function(req, res, next, lang) {
   var pattern = /^[a-z]{2}$/i;
   if (!pattern.test(lang)) {
      return next(new Error ('not a valid language code'));
   }
   req.lang = lang;
   return next();
};

exports.validateUserID = function(req, res, next, uid) {
   var pattern = /^[a-z]{7}\d$/i;
   if (!pattern.test(uid)) {
      return next(new Error ('not a valid user ID'));
   }
   req.uid = uid;
   return next();
};

exports.query = function(req, res) {
   var query = Exam.find().sort({ date: -1 });
   if (req.uid) {
      query = query.find({
         'student.id': req.uid
      });
   }
   if (req.subject) {
      query = query.find({
         subject: req.subject
      });
   }
   if (req.lang) {
      query = query.find({
         lang: req.lang
      });
   }
   if (req.date) {
      query = query.find({
         date: req.date
      });
   }
   query.populate('_blueprint', 'lede sections').exec(function(err, exams) {
      if (err) {
         res.send(500);
      } else if (!exams.length) {
         res.send(404);
      } else {
         res.send(exams);
      }
   });
};

exports.get = function(req, res) {
   Exam.findOne({
      subject: req.subject,
      lang: req.lang,
      date: req.date,
      'student.id': req.uid
   }).populate('_blueprint', 'lede sections').exec(function(err, exam) {
      if (err) {
         res.send(500);
      } else if (!exam) {
         res.send(404);
      } else {
         res.send(exam);
      }
   });
};

exports.create = function(req, res) {
   // req.body.answers.forEach(function(answer) {
   //    answer.content.forEach(function(chunk) {
   //       if (chunk.datatype === 'canvas') {
   //          svgo.optimize(chunk.content, function(result) {
   //             chunk.content = result.data;
   //          });
   //       }
   //    });
   // });

   var exam = new Exam(req.body);

   exam.save(function(err) {
      if (err) {
         res.send(500, err);
      } else {
         res.send(exam);
      }
   });
};

exports.all = function(req, res) {
   res.send('Hello world!');
};